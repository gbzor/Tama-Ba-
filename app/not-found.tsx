import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-20 sm:py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-display-lg leading-tight">
        Wala kaming mahanap na page na ito.
      </h1>
      <p className="mt-4 text-base text-ink-soft">
        The page you were looking for does not exist, or it moved. Try the lessons
        or the practice quiz instead.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
        <Link href="/learn">
          <Button variant="secondary">See lessons</Button>
        </Link>
      </div>
    </div>
  )
}
