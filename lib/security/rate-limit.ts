import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Rate limiter — sliding window.
 *
 * Two backends:
 *   1) Upstash Redis (preferred) — activates when both
 *      UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
 *      Distributed, survives cold starts, shared across Vercel regions.
 *   2) In-memory fallback — used in local dev and as a safety net.
 *      Per-instance only; will not block a determined attacker on Vercel.
 *
 * The exported interface is identical; middleware.ts does not change.
 */

// ---------- Limits (single source of truth) ----------

interface RouteLimit {
  tokens: number
  seconds: number
}

const ROUTE_LIMITS: Record<string, RouteLimit> = {
  '/api/check-claim': { tokens: 10, seconds: 60 }, // 10/min on write
  default:            { tokens: 60, seconds: 60 }, // 60/min fallback
}

function getLimitFor(pathname: string): { route: string; limit: RouteLimit } {
  for (const route of Object.keys(ROUTE_LIMITS)) {
    if (route !== 'default' && pathname.startsWith(route)) {
      return { route, limit: ROUTE_LIMITS[route] }
    }
  }
  return { route: 'default', limit: ROUTE_LIMITS.default }
}

// ---------- Upstash backend (lazy) ----------

let upstashLimiters: Map<string, Ratelimit> | null = null
let upstashInitFailed = false

function getUpstashLimiter(route: string, limit: RouteLimit): Ratelimit | null {
  if (upstashInitFailed) return null
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  try {
    if (!upstashLimiters) {
      upstashLimiters = new Map()
    }
    const cached = upstashLimiters.get(route)
    if (cached) return cached

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    const rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit.tokens, `${limit.seconds} s`),
      prefix: `rl:${route.replace(/[^a-z0-9]/gi, '-')}`,
      analytics: false,
      // 1s timeout: if Redis is unreachable, fail OPEN (allow the request)
      // rather than blocking the whole site. Rate limit is defense-in-depth,
      // not the primary auth gate.
      timeout: 1000,
      // In-process LRU cache for hot keys → cuts Upstash RPC volume.
      ephemeralCache: new Map(),
    })
    upstashLimiters.set(route, rl)
    return rl
  } catch (err) {
    upstashInitFailed = true
    console.error(JSON.stringify({
      kind: 'rate_limit_init_failed',
      message: err instanceof Error ? err.message : String(err),
    }))
    return null
  }
}

// ---------- In-memory backend (fallback) ----------

interface Bucket { hits: number[] }
const memoryStore = new Map<string, Bucket>()

function checkMemory(
  clientId: string,
  pathname: string,
  limit: RouteLimit,
): RateLimitResult {
  const windowMs = limit.seconds * 1000
  const max = limit.tokens
  const now = Date.now()
  const key = `${clientId}:${pathname}`
  const bucket = memoryStore.get(key) ?? { hits: [] }

  bucket.hits = bucket.hits.filter((t) => now - t < windowMs)

  const allowed = bucket.hits.length < max
  if (allowed) {
    bucket.hits.push(now)
    memoryStore.set(key, bucket)
  }

  // Periodic cleanup (best-effort, ~1% of calls)
  if (Math.random() < 0.01) {
    for (const [k, v] of memoryStore.entries()) {
      v.hits = v.hits.filter((t) => now - t < windowMs)
      if (v.hits.length === 0) memoryStore.delete(k)
    }
  }

  const oldest = bucket.hits[0] ?? now
  const retryAfter = allowed ? 0 : Math.ceil((windowMs - (now - oldest)) / 1000)

  return {
    allowed,
    limit: max,
    remaining: Math.max(0, max - bucket.hits.length),
    retryAfter,
  }
}

// ---------- Public surface ----------

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  retryAfter: number // seconds
}

export async function checkRateLimit(
  clientId: string,
  pathname: string,
): Promise<RateLimitResult> {
  const { route, limit } = getLimitFor(pathname)
  const upstash = getUpstashLimiter(route, limit)

  if (upstash) {
    try {
      const r = await upstash.limit(clientId)
      const retryAfter = r.success ? 0 : Math.max(0, Math.ceil((r.reset - Date.now()) / 1000))
      return {
        allowed: r.success,
        limit: r.limit,
        remaining: r.remaining,
        retryAfter,
      }
    } catch (err) {
      // Fail open on transient Redis errors — log and fall through.
      console.error(JSON.stringify({
        kind: 'rate_limit_upstash_error',
        message: err instanceof Error ? err.message : String(err),
      }))
      return checkMemory(clientId, pathname, limit)
    }
  }

  return checkMemory(clientId, pathname, limit)
}

// ---------- Client IP derivation ----------

/**
 * Derive the client IP from request headers.
 *
 * SECURITY: do NOT use the leftmost x-forwarded-for entry — it is
 * client-controlled. On Vercel the platform appends the real client IP to
 * whatever the client sent, so we read x-vercel-forwarded-for when present
 * (single trusted value), and otherwise use the RIGHTMOST x-forwarded-for
 * value (the closest hop, which is the trusted proxy's view of the client).
 */
export function getClientIp(req: NextRequest): string {
  const vercel = req.headers.get('x-vercel-forwarded-for')
  if (vercel) {
    const first = vercel.split(',')[0]?.trim()
    if (first) return first
  }
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean)
    const last = parts[parts.length - 1]
    if (last) return last
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

function getPepper(): string {
  const p = process.env.AUDIT_HMAC_PEPPER
  if (p && p.length >= 32) return p
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'AUDIT_HMAC_PEPPER is required in production and must be >= 32 chars. ' +
      'Set it via Vercel Project Settings → Environment Variables.',
    )
  }
  return 'dev-pepper-do-not-use-in-prod'
}

/**
 * Derives a client identifier WITHOUT exposing the raw IP.
 * For rate-limit bucketing only — audit logging uses HMAC-SHA256.
 */
export function getClientIdentifier(req: NextRequest): string {
  const ip = getClientIp(req)
  const pepper = getPepper()

  let hash = 0
  const combined = `${ip}|${pepper}`
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i)
    hash |= 0
  }
  return `rl_${Math.abs(hash).toString(36)}`
}
