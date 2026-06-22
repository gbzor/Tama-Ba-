import { NextRequest, NextResponse } from 'next/server'
import { checkClaimSchema } from '@/lib/validators'
import { isSafeUrl, normalizeClaimText } from '@/lib/security/sanitize'
import { FACT_CHECKERS, domainHeuristicWarning } from '@/lib/content/fact-checkers'
import { audit } from '@/lib/security/audit'
import { getClientIp } from '@/lib/security/rate-limit'

export const runtime = 'nodejs' // need node crypto for audit hashing

/**
 * Sensational keywords that indicate engagement-bait or unverified urgency.
 * Used to surface plain-language warnings to the user — never to make a verdict.
 */
const RED_FLAGS_TAGALOG = ['grabe', 'wow', 'shocking', 'breaking', 'i-share', 'share to', 'tara']
const RED_FLAGS_GENERIC = [
  'register here',
  'click here',
  'limited slots',
  'do not miss',
  'before it is deleted',
  'they do not want you to know',
  'the truth they are hiding',
]

function detectClaimWarnings(claim: string): string[] {
  const lower = claim.toLowerCase()
  const warnings: string[] = []

  const tagalogHits = RED_FLAGS_TAGALOG.filter((w) => lower.includes(w))
  const genericHits = RED_FLAGS_GENERIC.filter((w) => lower.includes(w))

  if (tagalogHits.length > 0 || genericHits.length > 0) {
    warnings.push(
      'The claim uses urgency or sensational language ("' +
        [...tagalogHits, ...genericHits].slice(0, 3).join('", "') +
        '"). Disinformation often manufactures urgency to short-circuit verification.',
    )
  }

  if (claim.length > 40 && claim === claim.toUpperCase()) {
    warnings.push('The claim is written in all-caps, a common engagement-bait pattern.')
  }

  if ((claim.match(/!/g) ?? []).length > 3) {
    warnings.push('Heavy exclamation use is a tell for emotionally manipulated content.')
  }

  return warnings
}

const STANDARD_GUIDANCE = [
  'Search the claim\'s exact words on Google, then add the word "fact check" — see what verified outlets have already published.',
  'If the source is an image or screenshot, reverse-image-search it before accepting the context it is presented in.',
  'Find the original primary source — an official statement, a video, an article on the actual outlet\'s site — not a screenshot of one.',
  'Check the date. A real-looking story from years ago, recycled today, is one of the most common patterns in Philippine social media.',
]

const MAX_BODY_BYTES = 8192

export async function POST(req: NextRequest) {
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  }

  let body: unknown
  try {
    const raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
    }
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = checkClaimSchema.safeParse(body)
  if (!parsed.success) {
    // Surface the first validation message, but no internal detail
    const message = parsed.error.issues[0]?.message ?? 'Please check your input.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const claim = normalizeClaimText(parsed.data.claim)
  const urlInput = parsed.data.url?.trim()

  const warnings: string[] = detectClaimWarnings(claim)

  if (urlInput) {
    const safety = isSafeUrl(urlInput)
    if (!safety.ok) {
      warnings.push(`The URL was rejected: ${safety.reason}`)
    } else {
      const heuristic = domainHeuristicWarning(safety.url.hostname)
      if (heuristic) warnings.push(heuristic)
    }
  }

  // Build PH fact-checker search links using the sanitized claim text
  const searchQuery = claim.slice(0, 120)
  const factCheckers = FACT_CHECKERS.map((fc) => ({
    name: fc.name,
    searchHref: fc.searchUrl(searchQuery),
    description: fc.description,
  }))

  audit({
    event: 'submission_create',
    ip: getClientIp(req),
    userAgent: req.headers.get('user-agent') ?? undefined,
    metadata: {
      claimLength: claim.length,
      hasUrl: Boolean(urlInput),
      warningCount: warnings.length,
    },
  })

  return NextResponse.json({
    warnings,
    factCheckers,
    guidance: STANDARD_GUIDANCE,
  })
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 })
}
