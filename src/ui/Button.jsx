import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useFinePointer } from '../lib/hooks.js'

const VARIANTS = {
  // Highest-priority action. Amber is used here and almost nowhere else.
  primary:
    'bg-amber text-ink-950 font-semibold shadow-[0_10px_40px_-12px_rgba(245,166,35,.75)] hover:shadow-[0_14px_54px_-10px_rgba(245,166,35,.9)]',
  outline:
    'border border-white/22 text-mist hover:border-cy/60 hover:text-white bg-white/[0.03]',
  ghostLight:
    'border border-ink-900/15 text-ink-900 hover:border-cy hover:text-ink-950 bg-white/60',
  cyan: 'bg-cy text-ink-950 font-semibold shadow-[0_10px_40px_-12px_rgba(34,211,238,.8)]',
}

const SIZES = {
  sm: 'h-10 px-4 text-[13px]',
  md: 'h-12 px-6 text-sm',
  lg: 'h-[58px] px-7 text-[15px]',
}

/**
 * Button that leans a few pixels toward the cursor and carries a soft
 * pointer-tracked highlight. Falls back to a plain button on touch devices and
 * for anyone who has asked for reduced motion.
 */
export default function MagneticButton({
  as = 'button',
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  strength = 14,
  ...props
}) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const enabled = fine && !reduce

  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 })

  const onMove = (e) => {
    if (!enabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
    x.set(dx * strength)
    y.set(dy * strength * 0.6)
    ref.current.style.setProperty('--bx', `${((e.clientX - r.left) / r.width) * 100}%`)
    ref.current.style.setProperty('--by', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  const Cmp = motion[as] ?? motion.button

  return (
    <Cmp
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      style={{ x: enabled ? x : 0, y: enabled ? y : 0 }}
      data-cursor="hover"
      className={`group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full transition-[box-shadow,border-color,color] duration-300 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(120px circle at var(--bx,50%) var(--by,50%), rgba(255,255,255,.28), transparent 60%)',
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap">
        {children}
      </span>
    </Cmp>
  )
}
