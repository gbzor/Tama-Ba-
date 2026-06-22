import { createHmac } from 'node:crypto'

/**
 * Audit log.
 * Sensitive identifiers (IP, UA) are ALWAYS hashed with HMAC-SHA256
 * before logging — never log raw IPs.
 */

export type AuditEvent =
  | 'submission_create'
  | 'submission_rate_limited'
  | 'submission_rejected'
  | 'login'
  | 'login_failed'
  | 'logout'
  | 'rate_limited'
  | 'csrf_blocked'

interface AuditPayload {
  event: AuditEvent
  ip?: string
  userAgent?: string
  userId?: string
  metadata?: Record<string, unknown>
}

/**
 * Fail-fast pepper accessor.
 * In production, refuses to start without a strong pepper so we never
 * silently log IPs hashed under the well-known dev fallback.
 */
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

function hashIdentifier(value: string): string {
  return createHmac('sha256', getPepper()).update(value).digest('hex').slice(0, 32)
}

export function audit(payload: AuditPayload): void {
  const record = {
    timestamp: new Date().toISOString(),
    event: payload.event,
    ipHash: payload.ip ? hashIdentifier(payload.ip) : undefined,
    uaHash: payload.userAgent ? hashIdentifier(payload.userAgent) : undefined,
    userId: payload.userId,
    metadata: payload.metadata,
  }
  console.log(JSON.stringify({ kind: 'audit', ...record }))
}
