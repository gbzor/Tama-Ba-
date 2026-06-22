'use client'

import { useState } from 'react'
import { Search, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CheckResult {
  warnings: string[]
  factCheckers: Array<{ name: string; searchHref: string; description: string }>
  guidance: string[]
}

export function ClaimChecker() {
  const [claim, setClaim] = useState('')
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const res = await fetch('/api/check-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim, url: url || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? 'Something went wrong. Please try again.')
        return
      }
      setResult(data)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="claim" className="block eyebrow mb-2">
            The claim
          </label>
          <textarea
            id="claim"
            name="claim"
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder='e.g. "Government will give P10,000 to all Filipinos next week, register here…"'
            className="w-full p-3 rounded-sm border border-ink/25 bg-newsprint focus:border-ink resize-y font-sans text-sm"
          />
          <p className="mt-1 text-xs text-ink-muted">
            <span className="font-mono">{claim.length}</span>/2000 characters
          </p>
        </div>

        <div>
          <label htmlFor="url" className="block eyebrow mb-2">
            Source URL <span className="lowercase">(optional)</span>
          </label>
          <input
            id="url"
            name="url"
            type="url"
            maxLength={2048}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className="w-full p-3 rounded-sm border border-ink/25 bg-newsprint focus:border-ink font-mono text-sm"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-sm border border-proof/40 bg-proof/5 text-sm text-proof-ink"
          >
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading || claim.trim().length < 10}>
          <Search size={16} />
          {loading ? 'Checking…' : 'Check this claim'}
        </Button>
      </form>

      {result && (
        <div className="mt-10 animate-fade-up">
          {result.warnings.length > 0 && (
            <section className="mb-8">
              <h3 className="font-display text-xl flex items-center gap-2">
                <AlertTriangle size={18} className="text-proof" />
                What we noticed
              </h3>
              <ul className="mt-3 space-y-2">
                {result.warnings.map((w, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed p-3 rounded-sm border border-proof/30 bg-proof/5"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {result.guidance.length > 0 && (
            <section className="mb-8">
              <h3 className="font-display text-xl flex items-center gap-2">
                <ShieldCheck size={18} className="text-archive" />
                Recommended next steps
              </h3>
              <ol className="mt-3 space-y-2 list-decimal pl-5">
                {result.guidance.map((g, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    {g}
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section>
            <h3 className="font-display text-xl">Verify with a PH fact-checker</h3>
            <p className="mt-1 text-sm text-ink-muted">
              These are IFCN-recognized or established Philippine fact-check operations.
              We do not vouch for any single result; cross-reference at least two.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {result.factCheckers.map((fc) => (
                <li key={fc.name}>
                  <a
                    href={fc.searchHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'block p-4 rounded-sm border border-ink/15 hover:border-ink/40 transition-all',
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-base">{fc.name}</span>
                      <ExternalLink size={14} className="text-ink-muted" />
                    </div>
                    <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                      {fc.description}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}
