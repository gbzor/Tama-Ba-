import Link from 'next/link'
import { FACT_CHECKERS } from '@/lib/content/fact-checkers'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10">
      <div className="mx-auto max-w-content px-5 sm:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl">Tama Ba?</p>
            <p className="mt-2 text-sm text-ink-muted max-w-xs">
              An independent, non-partisan platform for Philippine media literacy.
              Free to use, no ads, no tracking.
            </p>
          </div>

          <div>
            <p className="eyebrow">Verified PH fact-checkers</p>
            <ul className="mt-3 space-y-2 text-sm">
              {FACT_CHECKERS.map((fc) => (
                <li key={fc.name}>
                  <a
                    href={fc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-4 decoration-ink/40"
                  >
                    {fc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Site</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline underline-offset-4">About</Link></li>
              <li><Link href="/about#privacy" className="hover:underline underline-offset-4">Privacy</Link></li>
              <li><Link href="/about#methodology" className="hover:underline underline-offset-4">Methodology</Link></li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-4"
                >
                  Source on GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="editorial-rule mt-10" />

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-ink-muted">
          <p>
            <span className="font-mono">© {new Date().getFullYear()}</span> · Built for and by Filipinos.
          </p>
          <p className="font-display italic">Bago mo i-share, alamin muna.</p>
        </div>
      </div>
    </footer>
  )
}
