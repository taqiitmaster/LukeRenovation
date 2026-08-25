import { useCallback, useEffect, useRef, useState } from 'react'

/** Subscribe to a media query without re-running on every render. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** True only on devices with a precise pointer — gates the custom cursor + tilt. */
export const useFinePointer = () => useMediaQuery('(pointer: fine)')

export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')

/** Freeze the page behind the mobile menu / lightbox without a layout jump. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const { overflow, paddingRight } = document.body.style
    const gap = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [locked])
}

/** Smooth-scroll to a section id, offsetting for the sticky nav. */
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const top = el.getBoundingClientRect().top + window.scrollY - 84
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
}

/**
 * Fires once when the element first enters the viewport.
 * Used for count-ups and the before/after nudge hint.
 */
export function useInViewOnce(options = {}) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.35, ...options },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen])
  return [ref, seen]
}

/**
 * Reveal trigger.
 *
 * framer-motion's own `whileInView` is a no-op in the version pinned here, so
 * every scroll reveal on this page is driven by this hook instead: it reports
 * when an element enters the viewport and the component feeds that into a plain
 * `animate` prop. Deterministic, and it drops the observer once it has fired.
 *
 * The threshold is clamped when an element is taller than the viewport —
 * otherwise a tall grid could never reach, say, 60% visibility and would never
 * animate at all.
 */
export function useReveal({ amount = 0.3, once = true, margin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    // getBoundingClientRect works for SVG too, where offsetHeight is undefined.
    const height = el.getBoundingClientRect().height || 1
    const maxUsable = (window.innerHeight * 0.75) / height
    const threshold = Number.isFinite(maxUsable)
      ? Math.max(0, Math.min(amount, maxUsable))
      : 0

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [amount, once, margin])

  return [ref, inView]
}

/** rAF-throttled scroll subscription — one listener, no layout thrash. */
export function useRafScroll(handler) {
  const cb = useRef(handler)
  cb.current = handler
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        cb.current(window.scrollY)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

/** Stable callback ref helper. */
export function useEvent(fn) {
  const ref = useRef(fn)
  ref.current = fn
  return useCallback((...args) => ref.current(...args), [])
}
