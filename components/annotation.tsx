'use client'

import type { ReactNode } from 'react'

interface AnnotationProps {
  children: ReactNode
  variant?: 'ring' | 'underline' | 'strike'
  className?: string
}

/**
 * The signature element. Wraps text in an inline-block with an
 * absolutely-positioned SVG mark drawn over it.
 *
 * - `ring`: a hand-drawn proofreader's circle
 * - `underline`: an emphasized underline like a copy-edit highlight
 * - `strike`: a strikethrough for false claims
 */
export function Annotation({
  children,
  variant = 'ring',
  className,
}: AnnotationProps) {
  return (
    <span className={`relative inline-block ${className ?? ''}`}>
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 100 40"
      >
        {variant === 'ring' && (
          <path
            className="mark-circle"
            d="M 8 22 Q 4 8, 50 6 Q 96 8, 94 22 Q 96 34, 50 36 Q 4 34, 8 22"
          />
        )}
        {variant === 'underline' && (
          <path
            className="mark-underline"
            d="M 4 34 Q 25 30, 50 34 T 96 33"
          />
        )}
        {variant === 'strike' && (
          <path
            className="mark-strike"
            d="M 4 22 Q 50 18, 96 22"
          />
        )}
      </svg>
    </span>
  )
}
