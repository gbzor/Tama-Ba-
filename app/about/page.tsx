export const metadata = {
  title: 'About',
  description: 'Mission, privacy policy, methodology, and security practices.',
}

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <p className="eyebrow">About</p>
      <h1 className="mt-3 font-display text-display-lg leading-tight">
        Independent, free, non-partisan.
      </h1>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Mission</h2>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Tama Ba? is a free Philippine media literacy platform. We do not take sides
          in political debates, we do not run ads, and we do not sell data. Our goal
          is narrower and simpler: to help Filipinos build the habit of pausing
          before they share, and to give them the patterns they need to recognize
          disinformation when it appears.
        </p>
      </section>

      <section id="methodology" className="mt-12">
        <h2 className="font-display text-2xl">Methodology</h2>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Lessons and quiz questions are drawn from publicly documented patterns
          identified by Philippine fact-checking organizations — Rappler, VERA Files,
          Tsek.ph, and AFP Fact Check Philippines — and from peer-reviewed academic
          work on disinformation in the Philippines. We do not invent examples;
          where we use a tactic, that tactic has appeared repeatedly in PH social
          media reporting.
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          The Tama Ba? tool does not declare claims true or false. It only surfaces
          warning signs, recommends verification steps, and routes you to the
          fact-checkers who do the actual research.
        </p>
      </section>

      <section id="privacy" className="mt-12">
        <h2 className="font-display text-2xl">Privacy</h2>
        <ul className="mt-3 space-y-2 text-base leading-relaxed text-ink-soft list-disc pl-5">
          <li>No accounts. No login. No email collection.</li>
          <li>Your quiz streak is stored only in your browser&apos;s local storage. We never see it.</li>
          <li>Submissions to the Tama Ba? tool are processed in memory and discarded — not saved to a database.</li>
          <li>
            We do log security events (rate-limit hits, malformed requests) for
            abuse prevention. IP addresses are hashed with a server-side pepper
            before logging; we never store raw IPs.
          </li>
          <li>No third-party tracking scripts. No advertising pixels. No analytics.</li>
        </ul>
      </section>

      <section id="security" className="mt-12">
        <h2 className="font-display text-2xl">Security</h2>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          The site enforces a strict Content Security Policy with per-request
          nonces (no <code className="font-mono text-sm">unsafe-inline</code>),
          HSTS, frame denial, and a restrictive Permissions Policy. All API inputs
          are validated with schemas before any further processing. Rate limits
          apply to every API route. Same-origin enforcement protects state-changing
          requests against CSRF. Errors return generic messages to clients; full
          detail is logged server-side only.
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Found a security issue? Please report it responsibly via the contact
          listed in <code className="font-mono text-sm">SECURITY.md</code> on
          the project repository.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Open source</h2>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          The full source code is on GitHub under the MIT license. Contributions —
          new lessons, more quiz questions, translations into Tagalog and Bisaya —
          are welcome.
        </p>
      </section>
    </article>
  )
}
