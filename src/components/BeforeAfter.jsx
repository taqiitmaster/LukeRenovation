import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Img from '../ui/Img.jsx'
import { useInViewOnce } from '../lib/hooks.js'

const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n))

/**
 * Draggable before/after wipe.
 *
 * How it works
 * ------------
 * The AFTER photo is the base layer and always fully painted. The BEFORE photo
 * sits on top, clipped with `clip-path: inset()` from the right, so dragging
 * the handle left wipes the old bathroom away and reveals the finished one.
 *
 * Both layers are absolutely positioned inside a ratio box, so the two source
 * photos can have completely different aspect ratios (they do) and still line
 * up against a single crop.
 *
 * Input handling
 * --------------
 * Pointer Events cover mouse, touch and pen in one path. The container is set
 * to `touch-action: pan-y`, which hands vertical gestures back to the browser
 * for normal page scrolling while we keep horizontal ones — that's what stops
 * the slider from trapping a scrolling thumb on mobile.
 *
 * Position is written straight to a CSS custom property during the drag rather
 * than through React state, so a drag never triggers a re-render and never
 * drops a frame. React state only holds the value for the readout and for
 * keyboard users.
 */
export default function BeforeAfter({ project, index = 0 }) {
  const wrapRef = useRef(null)
  const beforeRef = useRef(null)
  const handleRef = useRef(null)
  const dragging = useRef(false)
  const reduce = useReducedMotion()

  const [pct, setPct] = useState(58)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [seenRef, seen] = useInViewOnce({ threshold: 0.45 })

  /** Paint a position without going through React. */
  const paint = useCallback((value) => {
    const v = clamp(value)
    if (beforeRef.current) {
      beforeRef.current.style.clipPath = `inset(0 ${100 - v}% 0 0)`
    }
    if (handleRef.current) {
      handleRef.current.style.left = `${v}%`
    }
    return v
  }, [])

  const commit = useCallback(
    (value) => {
      setPct(paint(value))
    },
    [paint],
  )

  const positionFromEvent = useCallback((clientX) => {
    const r = wrapRef.current.getBoundingClientRect()
    return ((clientX - r.left) / r.width) * 100
  }, [])

  const onPointerDown = (e) => {
    // Ignore secondary buttons so right-click doesn't yank the handle.
    if (e.button != null && e.button !== 0) return
    dragging.current = true
    setHasInteracted(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    paint(positionFromEvent(e.clientX))
  }

  const onPointerMove = (e) => {
    if (!dragging.current) return
    // Cheap: writes one CSS property, no React work, no layout read beyond
    // the cached rect measurement.
    paint(positionFromEvent(e.clientX))
  }

  const endDrag = (e) => {
    if (!dragging.current) return
    dragging.current = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    commit(positionFromEvent(e.clientX))
  }

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 3
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setHasInteracted(true)
      commit(pct - step)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setHasInteracted(true)
      commit(pct + step)
    } else if (e.key === 'Home') {
      e.preventDefault()
      commit(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      commit(100)
    }
  }

  /**
   * First-view nudge: sweep the handle once so it's obvious the divider is
   * draggable. Skipped entirely for reduced-motion users and cancelled the
   * moment someone grabs it themselves.
   */
  useEffect(() => {
    if (!seen || reduce || hasInteracted) return
    const from = 58
    const to = 30
    const duration = 1100
    const delay = 380 + index * 160
    let raf
    let start

    const tick = (now) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      // Out and back: 0 -> 1 -> 0 with an ease so it reads as a hint, not a glitch.
      const swing = Math.sin(t * Math.PI)
      const eased = swing * swing * (3 - 2 * swing)
      paint(from + (to - from) * eased)
      if (t < 1 && !dragging.current) raf = requestAnimationFrame(tick)
      else paint(from)
    }

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [seen, reduce, hasInteracted, index, paint])

  // Keep the DOM in sync if React re-renders for any other reason.
  useEffect(() => {
    paint(pct)
  }, [pct, paint])

  return (
    <figure ref={seenRef} className="group/ba">
      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ touchAction: 'pan-y' }}
        className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-white/10 bg-ink-800 sm:aspect-[16/11]"
      >
        {/* AFTER — base layer */}
        <Img
          image={project.after}
          alt={`${project.title} after renovation`}
          ratio="auto"
          sizes="(min-width: 1024px) 33vw, 92vw"
          className="absolute inset-0 h-full w-full"
        />

        {/* BEFORE — clipped overlay */}
        <div
          ref={beforeRef}
          className="absolute inset-0 will-change-[clip-path]"
          style={{ clipPath: 'inset(0 42% 0 0)' }}
        >
          <Img
            image={project.before}
            alt={`${project.title} before renovation`}
            ratio="auto"
            sizes="(min-width: 1024px) 33vw, 92vw"
            className="absolute inset-0 h-full w-full"
            imgClassName="saturate-[.72] contrast-[.95]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-ink-950/25" />
        </div>

        {/* Labels */}
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink-950/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mist/85 backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-cy/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-950 backdrop-blur-sm">
          After
        </span>

        {/* Divider + handle */}
        <div
          ref={handleRef}
          className="pointer-events-none absolute inset-y-0 z-10 -ml-px w-0.5 bg-gradient-to-b from-cy/20 via-cy to-cy/20"
          style={{ left: '58%', boxShadow: '0 0 18px rgba(34,211,238,.6)' }}
        >
          <button
            type="button"
            onKeyDown={onKeyDown}
            role="slider"
            aria-label={`Reveal the finished ${project.title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            aria-valuetext={`${Math.round(pct)}% before, ${100 - Math.round(pct)}% after`}
            className="pointer-events-auto absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-cy/60 bg-ink-950/70 backdrop-blur-md transition-transform duration-300 group-hover/ba:scale-110"
            style={{ boxShadow: '0 0 0 1px rgba(34,211,238,.18), 0 8px 30px rgba(0,0,0,.55)' }}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-0 rounded-full border border-cy/50 ${
                hasInteracted || reduce ? '' : 'animate-pulsering'
              }`}
            />
            <svg viewBox="0 0 24 24" width="18" height="18" className="text-cy" aria-hidden="true">
              <path
                d="M9.5 7.5 5 12l4.5 4.5M14.5 7.5 19 12l-4.5 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Drag affordance, fades out once used */}
        <span
          className={`pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink-950/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mist/70 backdrop-blur-sm transition-opacity duration-500 ${
            hasInteracted ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Drag to reveal
        </span>
      </div>

      <figcaption className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">{project.title}</h3>
          <p className="mt-1 text-[13px] text-mist/55">{project.meta}</p>
        </div>
        <span className="mt-1 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted/60">
          {String(index + 1).padStart(2, '0')}
        </span>
      </figcaption>
    </figure>
  )
}
