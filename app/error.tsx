'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // In production, this is where you would send to Sentry / observability.
    // Never expose `error.message` or `error.stack` to the user.
    if (process.env.NODE_ENV !== 'production') {
      console.error('Caught by error boundary:', error)
    }
  }, [error])

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-20 sm:py-32 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-3 font-display text-display-lg leading-tight">
        May nangyaring mali sa amin.
      </h1>
      <p className="mt-4 text-base text-ink-soft">
        It is on our end, not yours. Try again, or head back to the homepage.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-xs text-ink-muted">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-8 flex items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </div>
    </div>
  )
}
