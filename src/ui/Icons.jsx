import { motion } from 'framer-motion'
import { useReveal } from '../lib/hooks.js'

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

/**
 * Line icons drawn as stroked paths so they can animate themselves on — the
 * dash offset runs from "unbuilt" to "built", which suits a trade that
 * literally assembles things.
 */
export function DrawIcon({ children, size = 28, className = '', draw = true, delay = 0 }) {
  const [ref, inView] = useReveal({ amount: 0.4 })
  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      initial={draw ? 'hidden' : false}
      animate={inView || !draw ? 'show' : 'hidden'}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.09, delayChildren: delay } },
      }}
      {...base}
    >
      {children}
    </motion.svg>
  )
}

const Stroke = (props) => (
  <motion.path
    variants={{
      hidden: { pathLength: 0, opacity: 0 },
      show: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
      },
    }}
    {...props}
  />
)

export const ICON_PATHS = {
  // Services trio
  renovations: (
    <>
      <Stroke d="M4 14 16 5l12 9" />
      <Stroke d="M7 13v13h18V13" />
      <Stroke d="M13 26v-7h6v7" />
    </>
  ),
  kitchen: (
    <>
      <Stroke d="M5 6h22v20H5z" />
      <Stroke d="M5 16h22" />
      <Stroke d="M10 10v2M10 21v2" />
      <Stroke d="M21 10h2M21 21h2" />
    </>
  ),
  bathroom: (
    <>
      <Stroke d="M4 17h24" />
      <Stroke d="M6 17v4a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5v-4" />
      <Stroke d="M9 17V8a3 3 0 0 1 6 0v1" />
      <Stroke d="M12 9h5" />
    </>
  ),
  // Feature grid
  bolt: <Stroke d="M18 4 7 18h7l-1 10 11-14h-7z" />,
  gem: (
    <>
      <Stroke d="M9 5h14l5 8-12 14L4 13z" />
      <Stroke d="M4 13h24" />
      <Stroke d="M12 13 16 5l4 8-4 14z" />
    </>
  ),
  support: (
    <>
      <Stroke d="M6 19v-4a10 10 0 0 1 20 0v4" />
      <Stroke d="M6 17h3v7H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z" />
      <Stroke d="M26 17h-3v7h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2z" />
      <Stroke d="M23 24v1a3 3 0 0 1-3 3h-3" />
    </>
  ),
  wave: (
    <>
      <Stroke d="M3 12c3.5-4 7-4 10.5 0S21 16 24.5 12 29 8 29 8" />
      <Stroke d="M3 22c3.5-4 7-4 10.5 0S21 26 24.5 22 29 18 29 18" />
    </>
  ),
  rule: (
    <>
      <Stroke d="M3 11h26v10H3z" />
      <Stroke d="M8 11v4M13 11v6M18 11v4M23 11v6" />
    </>
  ),
  scan: (
    <>
      <Stroke d="M4 10V6a2 2 0 0 1 2-2h4" />
      <Stroke d="M28 10V6a2 2 0 0 0-2-2h-4" />
      <Stroke d="M4 22v4a2 2 0 0 0 2 2h4" />
      <Stroke d="M28 22v4a2 2 0 0 1-2 2h-4" />
      <Stroke d="M4 16h24" />
    </>
  ),
}

export function Phone({ className = '', size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...base}
      strokeWidth={1.7}
    >
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5L17 13l4 1.5v3a2.5 2.5 0 0 1-2.7 2.5C10.4 19.4 4.6 13.6 4 5.7A2.5 2.5 0 0 1 6.5 3z" />
    </svg>
  )
}

export function Arrow({ className = '', size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...base}
      strokeWidth={1.7}
    >
      <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
    </svg>
  )
}

export function Star({ className = '', size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z"
      />
    </svg>
  )
}

/** Animated tick used by the credentials checklist. */
export function CheckDraw({ className = '', size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...base} strokeWidth={2.2}>
      <motion.path
        d="M5 12.5 10 17.5 19.5 7"
        variants={{
          hidden: { pathLength: 0 },
          show: { pathLength: 1, transition: { duration: 0.5, ease: 'easeOut' } },
        }}
      />
    </svg>
  )
}
