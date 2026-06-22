# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in Tama Ba?, please report it responsibly.

**Do not** open a public GitHub issue. Instead, email:

```
security@<your-domain>
```

(Replace with the actual contact when you publish the project.)

Please include:
- A description of the issue and where it appears in the codebase
- Steps to reproduce
- Any proof-of-concept code, screenshots, or logs (with PII redacted)
- Your name and contact info if you would like credit in the fix

You can expect:
- An acknowledgement within **3 business days**
- An initial assessment within **7 business days**
- Reasonable updates as the fix progresses
- Credit in the changelog if you would like it (and you do not opt out)

## Supported versions

Only the `main` branch is supported. Always run the latest deployed version.

## Scope

In scope:
- This repository's code (Next.js application, middleware, API routes)
- Production deployments

Out of scope:
- Third-party dependencies — please report those upstream
- Social engineering of project maintainers
- Denial of service via simple flooding (rate limits exist; if you find a bypass, that *is* in scope)
- Issues that require physical access to a user's device

## Defensive baseline

The application implements:
- Strict Content Security Policy with per-request nonces
- Same-origin enforcement on state-changing requests
- Per-route rate limiting
- Zod input validation at every API entry
- DOMPurify sanitization for any rendered HTML
- HMAC-hashed IPs in audit logs (raw IPs never stored)
- Generic error messages to clients; full detail server-side only
- Strict security headers (HSTS, X-Frame-Options DENY, COOP, CORP, Permissions-Policy)
- SSRF protection via URL safety checks before any outbound fetch

See `README.md` → "Security architecture" for the full mapping to the OWASP Top 10.
