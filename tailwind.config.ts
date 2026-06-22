import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Two-tone base
        ink: {
          DEFAULT: '#0E0E0C',
          soft: '#1A1A17',
          muted: '#4A4A45',
          subtle: '#7A7A73',
        },
        newsprint: {
          DEFAULT: '#F5F1E8',
          soft: '#EDE8DC',
          deep: '#E2DCCB',
        },
        // Single accent — proofreader's red, used only on actually-false items
        proof: {
          DEFAULT: '#C8362D',
          soft: '#E6594F',
          ink: '#8A2218',
        },
        // Archive blue — verified sources only
        archive: {
          DEFAULT: '#2D4A6B',
          soft: '#456A92',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Editorial scale
        'display-xl': ['clamp(3rem, 8vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
      },
      maxWidth: {
        reading: '38rem',
        content: '76rem',
      },
      animation: {
        'mark-draw': 'mark-draw 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-up': 'fade-up 0.4s ease-out forwards',
      },
      keyframes: {
        'mark-draw': {
          '0%': { 'stroke-dashoffset': '100' },
          '100%': { 'stroke-dashoffset': '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
