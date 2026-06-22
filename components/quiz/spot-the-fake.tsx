'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import type { QuizQuestion } from '@/lib/content/questions'
import { Annotation } from '@/components/annotation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SpotTheFakeProps {
  question: QuizQuestion
  nextHref?: string
  onNext?: () => void
  showHeader?: boolean
}

type Phase = 'pristine' | 'selected' | 'revealed'

const STORAGE_KEY = 'tamaba.streak'

interface StoredStreak {
  current: number
  best: number
  lastAnswered: string // ISO date
}

export function SpotTheFake({
  question,
  nextHref,
  onNext,
  showHeader = true,
}: SpotTheFakeProps) {
  const [phase, setPhase] = useState<Phase>('pristine')
  const [selected, setSelected] = useState<string | null>(null)
  const [streak, setStreak] = useState<StoredStreak | null>(null)

  // Load streak from localStorage (client-only, never PII)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as StoredStreak
        if (
          typeof parsed?.current === 'number' &&
          typeof parsed?.best === 'number'
        ) {
          setStreak(parsed)
        }
      }
    } catch {
      // ignore parse errors — local data is non-critical
    }
  }, [])

  function persistStreak(next: StoredStreak) {
    setStreak(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // localStorage may be unavailable (private mode); fail silent
    }
  }

  function handleSelect(optionId: string) {
    if (phase !== 'pristine') return
    setSelected(optionId)
    setPhase('selected')
  }

  function handleReveal() {
    if (!selected) return
    const correct = question.options.find((o) => o.id === selected)?.isCorrect

    const today = new Date().toISOString().slice(0, 10)
    const prior = streak ?? { current: 0, best: 0, lastAnswered: '' }
    const isSameDay = prior.lastAnswered === today
    const nextCurrent = correct ? (isSameDay ? prior.current : prior.current + 1) : 0
    persistStreak({
      current: nextCurrent,
      best: Math.max(prior.best, nextCurrent),
      lastAnswered: today,
    })

    setPhase('revealed')
  }

  function handleReset() {
    setPhase('pristine')
    setSelected(null)
  }

  const selectedOption = question.options.find((o) => o.id === selected)
  const isCorrect = selectedOption?.isCorrect ?? false

  return (
    <div className="rounded-sm border border-ink/12 bg-newsprint p-6 sm:p-8">
      {showHeader && (
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">
            Spot the Fake · {question.topic}
          </p>
          {streak && streak.current > 0 && (
            <p className="font-mono text-xs text-ink-muted">
              streak <span className="text-ink">{streak.current}</span>
            </p>
          )}
        </div>
      )}

      {question.scenario && (
        <p className="mt-4 text-sm text-ink-muted italic font-display">
          {question.scenario}
        </p>
      )}

      <h2 className="mt-4 font-display text-display-md leading-tight">
        {question.prompt}
      </h2>

      <ul className="mt-6 space-y-3" role="radiogroup" aria-label="Answer choices">
        {question.options.map((option, idx) => {
          const isSelected = selected === option.id
          const reveal = phase === 'revealed'
          const showCorrect = reveal && option.isCorrect
          const showWrong = reveal && isSelected && !option.isCorrect

          return (
            <li key={option.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={phase === 'revealed'}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  'w-full text-left p-4 rounded-sm border transition-all duration-150 flex items-start gap-3',
                  isSelected
                    ? 'border-ink bg-ink/3'
                    : 'border-ink/15 hover:border-ink/40',
                  showCorrect && 'border-archive bg-archive/5',
                  showWrong && 'border-proof bg-proof/5',
                  phase !== 'pristine' && !isSelected && !showCorrect && 'opacity-50',
                )}
              >
                <span
                  className={cn(
                    'flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[0.7rem]',
                    isSelected ? 'border-ink bg-ink text-newsprint' : 'border-ink/30 text-ink-muted',
                    showCorrect && 'border-archive bg-archive text-newsprint',
                    showWrong && 'border-proof bg-proof text-newsprint',
                  )}
                >
                  {showCorrect ? (
                    <Check size={12} strokeWidth={3} />
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </span>
                <span className="text-sm sm:text-base leading-relaxed">
                  {showWrong ? (
                    <Annotation variant="strike">{option.text}</Annotation>
                  ) : (
                    option.text
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {phase === 'selected' && (
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={handleReset}>
            Change answer
          </Button>
          <Button onClick={handleReveal}>
            Reveal answer
            <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {phase === 'revealed' && (
        <div className="mt-6 border-t border-ink/10 pt-6">
          <div className="flex items-baseline gap-3">
            <p
              className={cn(
                'font-display text-xl',
                isCorrect ? 'text-archive' : 'text-proof',
              )}
            >
              {isCorrect ? 'Tama.' : 'Hindi tama.'}
            </p>
            <p className="eyebrow">{question.tactic}</p>
          </div>
          <p className="mt-3 text-sm sm:text-base leading-relaxed measure">
            {question.explanation}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw size={14} />
              Try again
            </Button>
            {(nextHref || onNext) && (
              <Button onClick={onNext}>
                Next question
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
