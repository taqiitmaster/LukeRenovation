import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Slow-drifting blurred gradient shapes. Purely decorative, pointer-events off,
 * animated with transform only so they never cost a layout pass.
 */
export function Aurora({ variant = 'cyan', className = '' }) {
  const palettes = {
    cyan: ['#22D3EE', '#2DD4BF'],
    amber: ['#F5A623', '#22D3EE'],
    mixed: ['#2DD4BF', '#F5A623'],
  }
  const [a, b] = palettes[variant] ?? palettes.cyan

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute -left-[18%] top-[-22%] h-[62vw] w-[62vw] animate-drift rounded-full blur-[110px]"
        style={{ background: a, opacity: 0.16, willChange: 'transform' }}
      />
      <div
        className="absolute -right-[14%] bottom-[-26%] h-[54vw] w-[54vw] animate-drift-slow rounded-full blur-[120px]"
        style={{ background: b, opacity: 0.13, willChange: 'transform' }}
      />
    </div>
  )
}

/** Faint architectural grid — the "drawing sheet" under the dark sections. */
export function GridLines({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
        backgroundSize: '88px 88px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 78%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 78%)',
      }}
    />
  )
}

/** Thin progress bar pinned to the very top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    restDelta: 0.001,
  })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-cy via-tl to-amber"
    />
  )
}
