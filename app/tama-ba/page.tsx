import { ClaimChecker } from '@/components/claim-checker'

export const metadata = {
  title: 'Tama Ba? — Check a claim',
  description:
    'Paste a suspicious message or link. Get warning signs, recommended next steps, and one-tap access to PH fact-checkers.',
}

export default function TamaBaPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <p className="eyebrow">The tool</p>
      <h1 className="mt-3 font-display text-display-lg leading-tight">
        Got something suspicious?
      </h1>
      <p className="mt-4 text-base text-ink-soft leading-relaxed measure">
        Paste the message, post, or claim below. We do not give you a yes/no verdict —
        we surface warning signs, walk you through a verification sequence, and link
        you to the major Philippine fact-checkers in one tap.
      </p>

      <div className="mt-8 p-3 border-l-2 border-ink/30 bg-ink/3 rounded-sm">
        <p className="text-xs font-mono uppercase tracking-wider text-ink-muted">
          What we store
        </p>
        <p className="mt-1 text-sm text-ink-soft leading-relaxed">
          Submissions are processed in memory and discarded. No claim text is saved
          to a database in this version. Only anonymized rate-limit counters and
          hashed audit events persist server-side.
        </p>
      </div>

      <div className="mt-10">
        <ClaimChecker />
      </div>
    </div>
  )
}
