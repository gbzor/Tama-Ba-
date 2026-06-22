/**
 * Trusted Philippine fact-checking organizations.
 * These are the destinations the Tama Ba? tool sends users to
 * when a claim cannot be auto-resolved.
 *
 * Editorial note: this list is maintained manually. Add to it conservatively.
 */
export interface FactChecker {
  name: string
  url: string
  searchUrl: (claim: string) => string
  description: string
}

export const FACT_CHECKERS: FactChecker[] = [
  {
    name: 'Rappler Fact Check',
    url: 'https://www.rappler.com/newsbreak/fact-check/',
    searchUrl: (claim) =>
      `https://www.rappler.com/?s=${encodeURIComponent(claim)}+fact+check`,
    description:
      'Long-running fact-check unit; IFCN-verified signatory. Strong on political and electoral claims.',
  },
  {
    name: 'VERA Files Fact Check',
    url: 'https://verafiles.org/specials/fact-checks',
    searchUrl: (claim) => `https://verafiles.org/?s=${encodeURIComponent(claim)}`,
    description:
      'IFCN-verified. Notable for deep dives on quote attribution and historical claims.',
  },
  {
    name: 'Tsek.ph',
    url: 'https://www.tsek.ph/',
    searchUrl: (claim) => `https://www.tsek.ph/?s=${encodeURIComponent(claim)}`,
    description:
      'Collaborative fact-checking project of Philippine journalism schools and newsrooms.',
  },
  {
    name: 'AFP Fact Check Philippines',
    url: 'https://factcheck.afp.com/list/all/all/all/35813/3',
    searchUrl: (claim) => `https://factcheck.afp.com/search?keys=${encodeURIComponent(claim)}`,
    description:
      'Agence France-Presse\'s Philippine desk. Strong on image and video verification.',
  },
]

/**
 * Domains that have repeatedly been flagged by Philippine fact-checkers
 * as carrying fabricated or systematically misleading content.
 *
 * This list is intentionally conservative. Inclusion does NOT mean
 * "everything on this domain is false" — it means "treat with caution
 * and verify independently."
 *
 * Editorial maintenance only; not user-modifiable.
 */
const FLAGGED_DOMAIN_KEYWORDS = [
  // Examples of patterns commonly seen in PH fabricated-news domains.
  // Not exhaustive; serves as a heuristic prompt for the user, not a verdict.
  'news-update',
  'breaking-ph',
  'pinoy-trending',
  'viral-pinas',
]

export function domainHeuristicWarning(hostname: string): string | null {
  const h = hostname.toLowerCase()
  for (const pattern of FLAGGED_DOMAIN_KEYWORDS) {
    if (h.includes(pattern)) {
      return `The domain "${hostname}" matches patterns common to known fabricated-news sites. Verify the claim through an established fact-checker before sharing.`
    }
  }
  return null
}
