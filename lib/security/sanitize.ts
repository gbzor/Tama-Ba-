import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'a', 'code'],
    ALLOWED_ATTR: ['href', 'title', 'rel', 'target'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  })
}

/**
 * Validate a URL is safe to display or fetch.
 * - Must be http(s)
 * - Must not point at private/loopback IPv4 ranges
 * - Must not point at private/loopback/link-local IPv6 ranges
 *
 * NOTE: this validates the STRING ONLY. If you later fetch the URL,
 * you MUST also re-resolve the hostname at fetch time and re-check the
 * resolved IP, otherwise DNS rebinding bypasses this check.
 */
export function isSafeUrl(input: string): { ok: true; url: URL } | { ok: false; reason: string } {
  let url: URL
  try { url = new URL(input) } catch { return { ok: false, reason: 'Not a valid URL.' } }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return { ok: false, reason: 'URL must use http or https.' }
  }

  const host = url.hostname.toLowerCase()
  const bareHost = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host

  // String-form internal hostnames
  const blockedHosts = ['localhost', '0.0.0.0', '::', '::1']
  if (blockedHosts.includes(bareHost)) {
    return { ok: false, reason: 'Internal hosts are not allowed.' }
  }

  // IPv4 private ranges (URL parser normalizes hex/decimal/octal forms to dotted)
  const ipv4 = bareHost.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4) {
    const [a, b] = ipv4.slice(1).map(Number)
    const isPrivate =
      a === 10 || a === 127 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254) || a === 0
    if (isPrivate) return { ok: false, reason: 'Private IP ranges are not allowed.' }
  }

  // IPv6 private/loopback/link-local
  if (bareHost.includes(':')) {
    const v6 = bareHost.toLowerCase()
    // ::1 loopback (covered above), unspecified, IPv4-mapped, ULA, link-local, multicast
    if (
      v6 === '::1' || v6 === '::' ||
      v6.startsWith('fc') || v6.startsWith('fd') ||   // fc00::/7 unique-local
      v6.startsWith('fe8') || v6.startsWith('fe9') || // fe80::/10 link-local
      v6.startsWith('fea') || v6.startsWith('feb') ||
      v6.startsWith('ff') ||                          // ff00::/8 multicast
      v6.startsWith('::ffff:') ||                     // IPv4-mapped — re-validate target
      v6.startsWith('64:ff9b:')                       // NAT64
    ) {
      return { ok: false, reason: 'Internal IPv6 address ranges are not allowed.' }
    }
  }

  return { ok: true, url }
}

export function normalizeClaimText(input: string): string {
  return input
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[\u200B-\u200F\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
