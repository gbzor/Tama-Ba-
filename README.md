# Tama Ba? — Philippine Media Literacy

> *Bago mo i-share, alamin muna.*
> (Before you share, find out first.)

A free, non-partisan, mobile-first web platform that trains young Filipinos to recognize, resist, and report disinformation. Built with Next.js 15 and designed to deploy on Vercel out of the box.

---

## What this is

The Philippines is one of the world's most disinformation-saturated information environments — and Filipinos aged 15–30 are simultaneously the most exposed, the most targeted, and the least equipped to defend against it. Media literacy is not yet a core part of the K-12 curriculum.

**Tama Ba?** addresses that gap with three loops:

| Loop | What it does |
|---|---|
| **Learn** | Short lessons (under 5 minutes each) on the disinformation techniques that actually circulate in PH social media — fabricated quote cards, recycled flood photos, troll farms, AI-generated images, historical revisionism. |
| **Practice** | "Spot the Fake" quizzes with real-context Philippine examples. Tracks streaks in `localStorage` — no account, nothing leaves the device. |
| **Apply** | The Tama Ba? tool: paste a suspicious claim or URL, get warning signs, recommended verification steps, and one-tap links to the major PH fact-checkers (Rappler, VERA Files, Tsek.ph, AFP Fact Check Philippines). |

---

## Features

- **No-account experience** — quizzes, lessons, and the claim checker all work without sign-in. Streaks stored client-side in `localStorage`.
- **Strict CSP with per-request nonces** — no `unsafe-inline`, no `unsafe-eval` in production.
- **Per-route rate limiting** — Upstash Redis (sliding window) when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, with in-memory fallback for local dev.
- **Same-origin enforcement** on all state-changing requests (CSRF defense).
- **HMAC-hashed identifiers** in audit logs — raw IPs are never stored.
- **Zod-validated** API inputs on every entry point.
- **DOMPurify sanitization** for any user-submitted text that might be rendered.
- **WCAG 2.1 AA** focus rings, skip links, reduced-motion support, sufficient contrast.
- **Mobile-first** responsive design from 360px up.
- **Editorial visual identity** — Newsreader display serif + Geist Sans + signature proofreader-mark annotations.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS with custom two-tone token system |
| Validation | Zod |
| Sanitization | isomorphic-dompurify |
| Icons | lucide-react (line icons only — no emoji) |
| Fonts | Newsreader, Geist Sans, Geist Mono (all via `next/font`) |
| Deployment | Vercel |

---

## Quick start

Requirements: **Node.js 20+**, **pnpm** (or npm/yarn).

```bash
git clone https://github.com/<your-username>/tama-ba.git
cd tama-ba
pnpm install
cp .env.example .env.local
# Generate a real HMAC pepper for AUDIT_HMAC_PEPPER:
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
# Paste the result into .env.local
pnpm dev
```

Visit `http://localhost:3000`.

---

## Environment variables

All variables are documented in [`.env.example`](./.env.example).

| Name | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical site URL for metadata |
| `AUDIT_HMAC_PEPPER` | Production | Server-side pepper used to HMAC-hash IPs before logging |
| `UPSTASH_REDIS_REST_URL` | Optional | Distributed rate limiting in multi-region deploys |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Auth for the above |

> Never commit `.env.local` or any file containing real secrets. They are listed in `.gitignore`.

---

## Folder structure

```
tama-ba/
├── app/
│   ├── api/check-claim/route.ts   # Server endpoint for the Tama Ba? tool
│   ├── learn/                     # Lesson index + dynamic lesson pages
│   ├── practice/                  # Quiz UI
│   ├── tama-ba/                   # Claim checker UI
│   ├── about/                     # About / privacy / methodology / security
│   ├── error.tsx                  # Error boundary — generic messages only
│   ├── not-found.tsx              # 404 page
│   ├── layout.tsx                 # Root layout with fonts + nav + footer
│   ├── page.tsx                   # Landing
│   └── globals.css                # Tailwind base + design tokens + proof-mark styles
├── components/
│   ├── ui/button.tsx
│   ├── quiz/spot-the-fake.tsx     # Interactive quiz client component
│   ├── annotation.tsx             # Signature: animated proofreader-mark SVGs
│   ├── claim-checker.tsx          # Tama Ba? tool client component
│   ├── nav.tsx
│   └── footer.tsx
├── lib/
│   ├── content/
│   │   ├── lessons.ts             # Lesson content (typed objects)
│   │   ├── questions.ts           # Quiz questions
│   │   └── fact-checkers.ts       # Curated PH fact-checker registry
│   ├── security/
│   │   ├── audit.ts               # HMAC-hashed security event logging
│   │   ├── rate-limit.ts          # Sliding-window limiter (swap for Upstash in prod)
│   │   └── sanitize.ts            # HTML sanitizer + URL safety + claim normalizer
│   ├── validators.ts              # Zod schemas for every API input
│   └── utils.ts
├── middleware.ts                  # CSP nonces, CSRF/origin, rate limiting
├── next.config.mjs                # Security headers
├── tailwind.config.ts             # Two-tone palette + type scale
├── tsconfig.json                  # Strict TS
├── .env.example                   # Placeholder env vars only
├── .gitignore
├── SECURITY.md                    # Responsible disclosure policy
├── LICENSE                        # MIT
└── README.md
```

---

## Security architecture

Security is wired in from the foundation — see [`SECURITY.md`](./SECURITY.md) for the full policy. Highlights:

- **Content Security Policy** is generated per request in `middleware.ts` with a fresh nonce. No `unsafe-inline`, no `unsafe-eval` in production. Next.js scripts and styled-jsx pick up the nonce automatically.
- **Static security headers** (`HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `COOP`, `CORP`) are set in `next.config.mjs`.
- **CSRF defense** — `middleware.ts` enforces same-origin on every non-idempotent method (`POST`, `PUT`, `PATCH`, `DELETE`) via `Origin`/`Referer` checks. Combined with the SameSite=Lax cookies that any future auth integration will use, this gives strong CSRF protection.
- **Rate limiting** — `lib/security/rate-limit.ts` implements a sliding-window limiter with two backends. When `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are present, it uses Upstash Redis via `@upstash/ratelimit` (distributed, survives cold starts, shared across regions). Otherwise it falls back to an in-memory store suitable for local dev. The limiter is applied in `middleware.ts` to every `/api/*` route. Client IP is read from `x-vercel-forwarded-for` first, then the rightmost `x-forwarded-for` entry — never the leftmost, which is client-spoofable.
- **Input validation** — every API entry point parses input with a Zod schema in `lib/validators.ts` before any further processing.
- **Output safety** — React's default escaping covers all rendered text. `lib/security/sanitize.ts` provides DOMPurify for the rare case where HTML must be rendered, plus URL safety (blocks `javascript:`, private IPs, and loopback).
- **Error handling** — `app/error.tsx` returns generic copy to users. The error digest is shown for support purposes; the actual `error.message` and stack are logged server-side only.
- **Audit logging** — `lib/security/audit.ts` writes structured JSON to stdout. IPs and user agents are HMAC-SHA256-hashed with a server-side pepper before logging — raw values are never persisted.

### OWASP Top 10 coverage

| Risk | Where it's handled |
|---|---|
| A01 Broken Access Control | No authenticated routes in this MVP; future auth uses Supabase RLS |
| A02 Cryptographic Failures | HTTPS-only (HSTS preloaded), HMAC for sensitive identifiers |
| A03 Injection | Zod validation, no dynamic SQL, DOMPurify for any rendered HTML |
| A04 Insecure Design | Threat model in design doc; this README; security review per PR |
| A05 Security Misconfiguration | Strict CSP, security headers, env-only secrets, no `poweredByHeader` |
| A06 Vulnerable Components | `pnpm audit` + Dependabot in CI |
| A07 Auth Failures | N/A in MVP; documented Argon2id + lockout + MFA path for production |
| A08 Integrity Failures | No external scripts; signed Vercel deploys |
| A09 Logging Failures | `audit.ts` structured logging |
| A10 SSRF | `isSafeUrl()` blocks private/loopback ranges before any outbound fetch |

---

## Deployment to Vercel

1. Push the repository to GitHub.
2. In Vercel, **New Project → Import Git Repository → Next.js**.
3. Set environment variables under **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` = your production URL
   - `AUDIT_HMAC_PEPPER` = a freshly generated 64-byte base64 string
4. Deploy. Vercel auto-handles HTTPS, HSTS, atomic deploys, and per-PR previews.

A failed build does not affect the running production deployment — Vercel only swaps on a successful build.

---

## Going to production

The MVP is intentionally lean. When you are ready to scale, swap in the following without rewriting the app:

| Concern | MVP | Production |
|---|---|---|
| Rate limiting | **Wired**: Upstash Redis when env vars set, in-memory fallback otherwise. See setup below. | — |
| Audit log | Structured stdout | Insert into `audit_log` table in Supabase (schema in the design doc) |
| Auth | None | Supabase Auth (email + magic link) — Argon2id, lockouts, optional TOTP |
| Persistence | None | Supabase Postgres with RLS — see design doc for schema |
| Monitoring | Vercel logs | Sentry for errors + Vercel Analytics |

Each swap is local to one file.

### Setting up Upstash Redis (5 minutes)

1. Go to [console.upstash.com](https://console.upstash.com) and create a free Redis database. Pick the region closest to your Vercel deployment.
2. On the database page, scroll to **REST API** and copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. In Vercel: **Project → Settings → Environment Variables**. Add both, scoped to Production (and Preview if you want preview deploys to share the limit).
4. Redeploy. The rate limiter switches over automatically — no code changes needed. You'll see Redis hits in the Upstash dashboard within seconds of the first request.

If Upstash is unreachable, the limiter fails open (allows the request) and logs `rate_limit_upstash_error` to Vercel logs so you can alert on it.

---

## Accessibility

- Skip-to-content link at the top of every page
- Visible focus rings (`outline: 2px ring-ink ring-offset-2`)
- Keyboard navigable everywhere — quiz options are `role="radio"` inside a `role="radiogroup"`
- All icons have `aria-hidden` or text labels
- Color is never the sole signal — correct/wrong states pair icons + text + color
- Respects `prefers-reduced-motion`
- Tested touch targets at 44×44 px minimum
- Page language declared as `en` (interface is English with Tagalog phrases in context; full Tagalog translation is on the roadmap)

---

## Roadmap

- Tagalog and Bisaya UI translations
- Browser extension to scan FB / X / TikTok inline
- Class Mode — teachers create class codes; students join, take assigned lessons
- Supabase Auth + persistent streaks and badges
- More quiz questions (target: 100+) and lessons (target: 25+)
- Partnered RSS ingestion from PH fact-checkers for the "Trending Disinfo Radar"
- Open read-only API for researchers

---

## Contributing

Contributions are welcome — especially:

- New lessons on disinformation techniques you have observed in PH social media (with citations to fact-checker coverage)
- New quiz questions (must be based on documented patterns, not hypothetical scenarios)
- Translations
- Accessibility improvements
- Security audits

Please open an issue first for substantial changes.

---

## License

MIT. See [`LICENSE`](./LICENSE).

---

## Acknowledgments

This project would not be possible without the ongoing work of Philippine fact-checking organizations — Rappler Fact Check, VERA Files, Tsek.ph, and AFP Fact Check Philippines — and the academic researchers who have documented disinformation tactics in the Philippines over the past decade.
