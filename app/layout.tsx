import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { Newsreader, Geist, Geist_Mono } from 'next/font/google'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: 'Tama Ba? — Philippine media literacy',
    template: '%s · Tama Ba?',
  },
  description:
    'A free, gamified platform that trains young Filipinos to recognize, resist, and report disinformation. Bago mo i-share, alamin muna.',
  keywords: [
    'Philippines',
    'media literacy',
    'fact check',
    'disinformation',
    'misinformation',
    'fake news',
    'Filipino',
  ],
  openGraph: {
    title: 'Tama Ba? — Philippine media literacy',
    description:
      'Train the skill of spotting disinformation in three minutes a day.',
    type: 'website',
    locale: 'en_PH',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F1E8',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? ''

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col" nonce={nonce}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-ink focus:text-newsprint focus:text-sm"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
