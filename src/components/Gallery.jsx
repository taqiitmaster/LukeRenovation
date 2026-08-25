import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GALLERY } from '../lib/content.js'
import { useScrollLock } from '../lib/hooks.js'
import Img from '../ui/Img.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'
import { Reveal } from '../ui/Motion.jsx'

function Lightbox({ index, onClose, onStep }) {
  const item = GALLERY[index]
  useScrollLock(true)

  const onKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    },
    [onClose, onStep],
  )

  useEffect(() => {
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKey])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[95] grid place-items-center bg-ink-950/95 p-4 backdrop-blur-xl sm:p-8"
    >
      <motion.figure
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl"
      >
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <Img
            image={item.img}
            alt={item.caption}
            sizes="(min-width: 900px) 880px, 92vw"
            priority
            className="max-h-[74vh] w-full"
          />
        </div>
        <figcaption className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-mist/70">{item.caption}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
            {index + 1} / {GALLERY.length}
          </p>
        </figcaption>
      </motion.figure>

      <button
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-mist sm:right-8 sm:top-8"
      >
        ✕
      </button>
      {['prev', 'next'].map((d) => (
        <button
          key={d}
          onClick={(e) => {
            e.stopPropagation()
            onStep(d === 'next' ? 1 : -1)
          }}
          aria-label={d === 'next' ? 'Next photo' : 'Previous photo'}
          className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 text-mist sm:grid ${
            d === 'next' ? 'right-6' : 'left-6'
          }`}
        >
          {d === 'next' ? '→' : '←'}
        </button>
      ))}
    </motion.div>
  )
}

export default function Gallery() {
  const [open, setOpen] = useState(null)
  const step = (delta) =>
    setOpen((i) => (i === null ? i : (i + delta + GALLERY.length) % GALLERY.length))

  return (
    <section className="grain grain-light relative overflow-hidden bg-paper py-20 sm:py-28">
      <div className="shell relative">
        <SectionHeader
          theme="light"
          eyebrow="Gallery"
          lines={['Take a Look at Our', 'Latest Gallery.']}
          lede="Finished bathrooms and kitchens from across Sydney's inner suburbs."
        />

        {/* CSS columns give a true masonry flow without a layout library. */}
        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {GALLERY.map((g, i) => (
            <Reveal key={g.caption} delay={(i % 3) * 0.08} className="break-inside-avoid">
              <button
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-ink-800 text-left"
              >
                <Img
                  image={g.img}
                  alt={g.caption}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 48vw, 92vw"
                  imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                  className="w-full"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-[13px] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Social strip — visual only in this demo. */}
        <Reveal delay={0.1} className="mt-16">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-ink-900/8 bg-white/70 p-8 text-center backdrop-blur-sm sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-700/60">
                Behind the scenes
              </p>
              <p className="mt-2 font-display text-xl font-semibold text-ink-950">
                Follow the builds on Instagram
              </p>
            </div>
            <div className="flex gap-3">
              {GALLERY.slice(0, 4).map((g) => (
                <div
                  key={`ig-${g.caption}`}
                  className="h-16 w-16 overflow-hidden rounded-lg sm:h-20 sm:w-20"
                >
                  <Img image={g.img} alt="" ratio="1 / 1" className="h-full w-full" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox index={open} onClose={() => setOpen(null)} onStep={step} />
        )}
      </AnimatePresence>
    </section>
  )
}
