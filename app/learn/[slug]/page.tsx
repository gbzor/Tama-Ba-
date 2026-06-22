import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { LESSONS, getLessonBySlug } from '@/lib/content/lessons'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const lesson = getLessonBySlug(slug)
  if (!lesson) return { title: 'Lesson not found' }
  return {
    title: lesson.title,
    description: lesson.subtitle,
  }
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params
  const lesson = getLessonBySlug(slug)
  if (!lesson) notFound()

  const currentIdx = LESSONS.findIndex((l) => l.slug === lesson.slug)
  const prev = currentIdx > 0 ? LESSONS[currentIdx - 1] : null
  const next = currentIdx < LESSONS.length - 1 ? LESSONS[currentIdx + 1] : null

  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors"
      >
        <ArrowLeft size={14} />
        All lessons
      </Link>

      <header className="mt-8">
        <p className="eyebrow">{lesson.topic}</p>
        <h1 className="mt-3 font-display text-display-lg leading-tight">
          {lesson.title}
        </h1>
        <p className="mt-4 text-xl text-ink-soft leading-snug font-display italic">
          {lesson.subtitle}
        </p>
        <p className="mt-6 font-mono text-xs text-ink-muted">
          {lesson.readingMinutes} min read · Difficulty {lesson.difficulty}/5
        </p>
      </header>

      <div className="editorial-rule my-10" />

      <div className="space-y-7">
        {lesson.sections.map((section, idx) => (
          <section key={idx}>
            {section.heading && (
              <h2 className="font-display text-2xl leading-tight mb-3">
                {section.heading}
              </h2>
            )}
            <p className="text-base leading-relaxed text-ink-soft">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <aside className="mt-12 p-6 border-l-2 border-archive bg-archive/5 rounded-sm">
        <p className="eyebrow text-archive">Takeaway</p>
        <p className="mt-2 font-display text-lg leading-snug">
          {lesson.takeaway}
        </p>
      </aside>

      <nav className="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Lesson navigation">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="p-4 rounded-sm border border-ink/15 hover:border-ink/40 transition-colors group"
          >
            <p className="font-mono text-xs text-ink-muted flex items-center gap-1">
              <ArrowLeft size={12} /> Previous
            </p>
            <p className="mt-1 font-display text-base">{prev.title}</p>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link
            href={`/learn/${next.slug}`}
            className="p-4 rounded-sm border border-ink/15 hover:border-ink/40 transition-colors group text-right sm:text-right"
          >
            <p className="font-mono text-xs text-ink-muted flex items-center gap-1 justify-end">
              Next <ArrowRight size={12} />
            </p>
            <p className="mt-1 font-display text-base">{next.title}</p>
          </Link>
        )}
      </nav>

      <div className="mt-16 p-6 rounded-sm bg-ink text-newsprint">
        <p className="eyebrow text-newsprint/60">Apply it</p>
        <p className="mt-2 font-display text-xl leading-snug">
          Try spotting this technique in a real example.
        </p>
        <Link
          href="/practice"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
        >
          Open Practice <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  )
}
