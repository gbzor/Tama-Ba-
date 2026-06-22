import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { LESSONS } from '@/lib/content/lessons'

export const metadata = {
  title: 'Learn',
  description: 'Short lessons on the disinformation patterns Filipinos see every day.',
}

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-content px-5 sm:px-8 py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">The pattern catalogue</p>
        <h1 className="mt-3 font-display text-display-lg leading-tight">
          The techniques behind what you scroll past.
        </h1>
        <p className="mt-4 text-lg text-ink-soft leading-relaxed measure">
          Each lesson covers one disinformation technique, grounded in real
          Philippine examples. None of them takes more than five minutes to read.
        </p>
      </div>

      <ul className="mt-14 grid gap-6 md:grid-cols-2">
        {LESSONS.map((lesson, idx) => (
          <li key={lesson.slug}>
            <Link
              href={`/learn/${lesson.slug}`}
              className="group block p-6 rounded-sm border border-ink/15 hover:border-ink/45 transition-all hover:-translate-y-px hover:shadow-[0_2px_0_0_rgba(14,14,12,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-xs text-ink-muted">
                  {String(idx + 1).padStart(2, '0')} · {lesson.topic}
                </p>
                <ArrowUpRight
                  size={16}
                  className="text-ink-muted group-hover:text-ink transition-colors"
                />
              </div>
              <h2 className="mt-4 font-display text-2xl sm:text-3xl leading-tight">
                {lesson.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {lesson.subtitle}
              </p>
              <p className="mt-4 font-mono text-xs text-ink-muted">
                {lesson.readingMinutes} min read · Difficulty {lesson.difficulty}/5
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
