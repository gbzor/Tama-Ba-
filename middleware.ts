import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIdentifier } from '@/lib/security/rate-limit'

/**
 * Strict CSP — no 'unsafe-inline', no 'unsafe-eval'.
 * Nonces are generated per request and injected by Next.js into <Script> tags
 * and styled-jsx via the `nonce` value read from headers in app/layout.tsx.
 */
function buildCSP(nonce: string): string {
  const isDev = process.env.NODE_ENV !== 'production'

  // Next.js requires 'unsafe-eval' in development for HMR.
  // In production we drop it.
  const scriptSrc = isDev
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`

  return [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' data: blob:`,
    `font-src 'self' data:`,
    `connect-src 'self'`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ')
}

/**
 * CSRF defense: for state-changing methods, verify Origin or Referer
 * matches the host. Combined with SameSite=Lax cookies, this gives strong CSRF
 * protection without a token mechanism for our current endpoints.
 */
function isSameOrigin(req: NextRequest): boolean {
  const method = req.method.toUpperCase()
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true

  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  const host = req.headers.get('host')

  if (!host) return false

  const expected = new Set([`https://${host}`, `http://${host}`])

  if (origin && expected.has(origin)) return true
  if (referer) {
    try {
      const refUrl = new URL(referer)
      if (expected.has(`${refUrl.protocol}//${refUrl.host}`)) return true
    } catch {
      return false
    }
  }
  return false
}

export async function middleware(request: NextRequest) {
  // 1. CSRF / same-origin enforcement on state-changing requests
  if (!isSameOrigin(request)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // 2. Rate limiting on API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const clientId = getClientIdentifier(request)
    const result = await checkRateLimit(clientId, request.nextUrl.pathname)
    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(result.retryAfter),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': '0',
          },
        },
      )
    }
  }

  // 3. Generate per-request CSP nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = buildCSP(nonce)

  // Pass the nonce to the application via request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('x-csp', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Set CSP on the response
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('x-nonce', nonce)

  return response
}

export const config = {
  matcher: [
    // Apply to all routes except static assets and Next.js internals
    {
      source: '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
