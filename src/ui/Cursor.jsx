import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useFinePointer } from '../lib/hooks.js'

/**
 * Soft glowing dot that trails the pointer and swells over interactive
 * elements. Mounted only when a fine pointer is present, so touch devices keep
 * their native behaviour and pay nothing for this.
 */
export default function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 700, damping: 42, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 700, damping: 42, mass: 0.35 })

  useEffect(() => {
    if (!fine || reduce) return

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
      // One delegated hit-test rather than listeners on every element.
      const el = e.target instanceof Element ? e.target : null
      setActive(
        !!el?.closest('a,button,[data-cursor="hover"],input,textarea,label[role="button"]'),
      )
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [fine, reduce, visible, x, y])

  if (!fine || reduce) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden lg:block"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        animate={{ scale: active ? 2.6 : 1, opacity: active ? 0.55 : 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="-ml-[7px] -mt-[7px] h-[14px] w-[14px] rounded-full bg-cy"
        style={{ boxShadow: '0 0 22px 6px rgba(34,211,238,.45)' }}
      />
    </motion.div>
  )
}
