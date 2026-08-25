import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useFinePointer, useInViewOnce, useReveal } from '../lib/hooks.js'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Scroll reveals are driven by `useReveal` + a plain `animate` prop rather than
 * framer's `whileInView`, which does not fire in the version pinned here.
 * Same API surface for callers, just a dependable trigger underneath.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
  as = 'div',
  amount = 0.25,
}) {
  const reduce = useReducedMotion()
  const [ref, inView] = useReveal({ amount })
  const Cmp = motion[as] ?? motion.div

  return (
    <Cmp
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </Cmp>
  )
}

/** Staggered container — pair with Stagger.Item children. */
export function Stagger({ children, className = '', gap = 0.08, amount = 0.2 }) {
  const reduce = useReducedMotion()
  const [ref, inView] = useReveal({ amount })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : 'hidden'}
      animate={inView || reduce ? 'show' : 'hidden'}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  )
}

Stagger.Item = function StaggerItem({ children, className = '', y = 24 }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Kinetic heading. Each line sits in an overflow-hidden mask and slides up from
 * beneath it, so the type appears to be uncovered rather than faded in.
 */
export function KineticHeading({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
  as: Tag = 'h2',
}) {
  const reduce = useReducedMotion()
  const [ref, inView] = useReveal({ amount: 0.45 })

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={reduce ? false : { y: '110%' }}
            animate={inView || reduce ? { y: '0%' } : { y: '110%' }}
            transition={{ duration: 0.9, delay: delay + i * 0.09, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Number that counts up the first time it scrolls into view. */
export function CountUp({ to, duration = 1500, suffix = '', prefix = '', className = '' }) {
  const [ref, seen] = useInViewOnce()
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!seen) return
    if (reduce) return setValue(to)
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutExpo — fast off the line, gentle landing.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setValue(Math.round(eased * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}

/**
 * Card that tilts toward the cursor and carries a spotlight that tracks the
 * pointer. Disabled on touch and for reduced-motion users.
 */
export function TiltCard({ children, className = '', max = 8, glow = true }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const enabled = fine && !reduce

  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 })
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 })

  const onMove = (e) => {
    if (!enabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set((0.5 - py) * max * 2)
    // Spotlight position handed to CSS — avoids a React render per pointer move.
    ref.current.style.setProperty('--mx', `${px * 100}%`)
    ref.current.style.setProperty('--my', `${py * 100}%`)
  }

  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{
        rotateX: enabled ? rx : 0,
        rotateY: enabled ? ry : 0,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
      }}
      className={`group relative ${className}`}
    >
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(340px circle at var(--mx,50%) var(--my,50%), rgba(34,211,238,.15), transparent 62%)',
          }}
        />
      )}
      {children}
    </motion.div>
  )
}

export { EASE }
