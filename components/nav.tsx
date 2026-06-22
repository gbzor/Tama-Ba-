'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/learn', label: 'Learn' },
  { href: '/practice', label: 'Practice' },
  { href: '/tama-ba', label: 'Tama Ba?' },
  { href: '/about', label: 'About' },
]

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-newsprint/85 backdrop-blur-md">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="group flex items-baseline gap-2"
            aria-label="Tama Ba? home"
          >
            <span className="font-display text-2xl font-medium tracking-tight">
              Tama Ba?
            </span>
            <span className="hidden sm:inline font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-muted">
              PH media literacy
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-3 -mr-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-200',
            open ? 'max-h-64 pb-4' : 'max-h-0',
          )}
        >
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-base border-t border-ink/8 first:border-t-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
