import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Annotation } from '@/components/annotation'
import { SpotTheFake } from '@/components/quiz/spot-the-fake'
import { Button } from '@/components/ui/button'
import { getRandomQuestion } from '@/lib/content/questions'

export default function Home() {
  // Pick a deterministic-but-varied opener question
  const question = getRandomQuestion()

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-content px-5 sm:px-8 pt-16 sm:pt-24 pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16 items-start">
          <div>
            <p className="eyebrow">A free Philippine media literacy tool</p>
            <h1 className="mt-4 font-display text-display-xl leading-[0.95]">
              Bago mo i-
              <Annotation variant="ring">share</Annotation>,
              <br />
              alamin{' '}
              <Annotation variant="underline">muna</Annotation>.
            </h1>
            <p className="mt-8 measure text-lg sm:text-xl leading-relaxed text-ink-soft">
              Filipinos spend more time on social media than almost anyone else on Earth.
              The same scroll that shows your titas, your barkada, and your news also
              carries fabricated quotes, recycled flood photos, and AI-generated
              politicians. <span className="italic">Tama Ba?</span> trains you to catch
              them — three minutes a day, no account required.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/practice">
                <Button size="lg">
                  Start practicing
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/learn">
                <Button size="lg" variant="secondary">
                  Read the lessons
                </Button>
              </Link>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <p className="eyebrow mb-3">Try one now</p>
            <SpotTheFake question={question} showHeader={false} />
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="editorial-rule" />
      </div>

      {/* The three loops */}
      <section className="mx-auto max-w-content px-5 sm:px-8 py-20">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-3 font-display text-display-lg max-w-3xl leading-tight">
          Three habits, repeated until they become reflexes.
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <article>
            <p className="font-mono text-xs text-ink-muted">01 / Learn</p>
            <h3 className="mt-2 font-display text-2xl">The pattern catalogue</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Short lessons — under five minutes each — on the techniques behind
              the disinformation you actually see: quote cards, recycled photos,
              troll farms, AI-generated images, historical revisionism.
            </p>
            <Link
              href="/learn"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline underline-offset-4"
            >
              Open the lessons <ArrowRight size={14} />
            </Link>
          </article>

          <article>
            <p className="font-mono text-xs text-ink-muted">02 / Practice</p>
            <h3 className="mt-2 font-display text-2xl">Spot the fake</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Side-by-side posts, real Philippine examples, one correct answer.
              Your streak lives in your browser — nothing leaves your device,
              no account needed.
            </p>
            <Link
              href="/practice"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline underline-offset-4"
            >
              Take a quiz <ArrowRight size={14} />
            </Link>
          </article>

          <article>
            <p className="font-mono text-xs text-ink-muted">03 / Apply</p>
            <h3 className="mt-2 font-display text-2xl">Paste a suspicious claim</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Drop a viral message or URL into the Tama Ba? tool. We surface
              warning signs, recommend a verification sequence, and link you to
              the four major PH fact-checkers in one tap.
            </p>
            <Link
              href="/tama-ba"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline underline-offset-4"
            >
              Try the checker <ArrowRight size={14} />
            </Link>
          </article>
        </div>
      </section>

      {/* Editorial closing */}
      <section className="mx-auto max-w-content px-5 sm:px-8 py-20 border-t border-ink/10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="eyebrow">Why this exists</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl leading-snug measure">
              Media literacy is not yet in the K–12 curriculum. The skill of pausing
              before a share button — of asking <em>tama ba ito</em> — is something
              you have to build on your own. We made the building easier.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
