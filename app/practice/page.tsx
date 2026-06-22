'use client'

import { useState, useMemo } from 'react'
import { SpotTheFake } from '@/components/quiz/spot-the-fake'
import { QUESTIONS, getRandomQuestion } from '@/lib/content/questions'

export default function PracticePage() {
  const [seenIds, setSeenIds] = useState<string[]>([])
  const [currentId, setCurrentId] = useState<string>(() => QUESTIONS[0].id)
  const [key, setKey] = useState(0) // forces SpotTheFake remount on next

  const current = useMemo(
    () => QUESTIONS.find((q) => q.id === currentId) ?? QUESTIONS[0],
    [currentId],
  )

  function handleNext() {
    const nextSeen = [...seenIds, currentId]
    const next = getRandomQuestion(nextSeen)
    setSeenIds(nextSeen.length >= QUESTIONS.length ? [] : nextSeen)
    setCurrentId(next.id)
    setKey((k) => k + 1)
  }

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="mb-8">
        <p className="eyebrow">Practice</p>
        <h1 className="mt-3 font-display text-display-lg leading-tight">
          Spot the fake.
        </h1>
        <p className="mt-3 text-base text-ink-soft measure">
          One question at a time. Pick an answer, reveal the technique behind it,
          move on. Your streak saves in your browser — there is no account and
          nothing leaves your device.
        </p>
      </div>

      <SpotTheFake key={key} question={current} onNext={handleNext} />

      <p className="mt-6 text-xs text-ink-muted text-center">
        Question {seenIds.length + 1} · {QUESTIONS.length} total
      </p>
    </div>
  )
}
