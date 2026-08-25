/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Slash modifiers (text-mist/62, border-white/8 …) resolve against this
      // scale, so open it up to every integer rather than the default steps.
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [i, String(i / 100)]),
      ),
      colors: {
        // Cinematic dark canvas
        ink: {
          950: '#070A0E',
          900: '#0B0F14',
          800: '#111820',
          700: '#161F29',
          600: '#1E2A36',
        },
        // Light bands
        paper: '#F4F6F7',
        chalk: '#FFFFFF',
        // Accents pulled from the existing brand
        cy: '#22D3EE', // logo cyan
        tl: '#2DD4BF', // logo teal
        amber: '#F5A623', // existing CTA amber
        mist: '#E8ECEF',
        muted: '#9AA3AD',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      maxWidth: {
        shell: '1280px',
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(6%,-8%,0) scale(1.12)' },
          '66%': { transform: 'translate3d(-7%,5%,0) scale(0.94)' },
        },
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        pulsering: {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '70%': { transform: 'scale(1.5)', opacity: '0' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        sheen: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        drift: 'drift 26s ease-in-out infinite',
        'drift-slow': 'drift 38s ease-in-out infinite',
        marquee: 'marquee 60s linear infinite',
        pulsering: 'pulsering 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        sheen: 'sheen 1.1s ease-out',
      },
    },
  },
  plugins: [],
}
