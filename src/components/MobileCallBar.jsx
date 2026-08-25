import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { BRAND } from '../lib/content.js'
import { scrollToId, useRafScroll } from '../lib/hooks.js'
import { Phone, Arrow } from '../ui/Icons.jsx'

/**
 * Always-reachable phone number on mobile. Appears once the hero's own CTAs
 * have scrolled away, so it never competes with them.
 */
export default function MobileCallBar() {
  const [show, setShow] = useState(false)
  useRafScroll((y) => setShow(y > window.innerHeight * 0.65))

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-[65] lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="glass m-3 flex items-center gap-2 rounded-2xl p-2">
            <a
              href={BRAND.phoneHref}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-xl bg-cy py-3.5 text-sm font-semibold text-ink-950"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-pulsering rounded-xl border border-cy"
              />
              <Phone size={16} />
              Call {BRAND.phone}
            </a>
            <button
              onClick={() => scrollToId('quote')}
              aria-label="Get a quote"
              className="grid h-[46px] w-[52px] shrink-0 place-items-center rounded-xl bg-amber text-ink-950"
            >
              <Arrow size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
