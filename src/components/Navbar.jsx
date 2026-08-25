import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND, NAV_LINKS } from '../lib/content.js'
import { LOGO_LIGHT } from '../lib/images.js'
import { scrollToId, useRafScroll, useScrollLock } from '../lib/hooks.js'
import MagneticButton from '../ui/Button.jsx'
import { Arrow, Phone } from '../ui/Icons.jsx'

/** Phone pill with a slow expanding ring behind it. */
function CallPill({ className = '', compact = false }) {
  return (
    <a
      href={BRAND.phoneHref}
      className={`relative inline-flex items-center gap-2 rounded-full border border-cy/35 bg-cy/10 px-4 py-2 text-[13px] font-medium text-cy transition-colors duration-300 hover:bg-cy/20 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-pulsering rounded-full border border-cy/50"
      />
      <Phone size={15} />
      <span className="relative">{compact ? 'Call' : BRAND.phone}</span>
    </a>
  )
}

/** Non-functional links still render, so the client sees the full IA. */
function DisabledLink({ label, className = '' }) {
  return (
    <span
      aria-disabled="true"
      title="Coming soon"
      className={`group relative cursor-not-allowed whitespace-nowrap text-mist/45 transition-colors duration-200 hover:text-mist/65 ${className}`}
    >
      {label}
      <span className="pointer-events-none absolute -bottom-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-ink-800 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
        Coming soon
      </span>
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useScrollLock(open)
  useRafScroll((y) => setScrolled(y > 24))

  const go = (id) => {
    setOpen(false)
    // Wait for the menu to unmount before measuring the target's position.
    setTimeout(() => scrollToId(id), open ? 260 : 0)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-[padding] duration-500 ${
          scrolled ? 'pt-0' : 'pt-3 sm:pt-4'
        }`}
      >
        <div className={`shell transition-all duration-500 ${scrolled ? 'max-w-none px-0' : ''}`}>
          <nav
            className={`flex items-center justify-between gap-4 border transition-all duration-500 ${
              scrolled
                ? 'h-[62px] rounded-none border-x-0 border-t-0 border-white/10 bg-ink-950/80 px-5 backdrop-blur-2xl sm:px-8 lg:px-10'
                : 'glass h-[70px] rounded-2xl px-4 sm:px-5'
            }`}
          >
            {/* Logo */}
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault()
                go('top')
              }}
              className="flex shrink-0 items-center"
              aria-label={`${BRAND.name} — home`}
            >
              <img
                src={LOGO_LIGHT}
                alt={BRAND.name}
                width={350}
                height={90}
                className={`w-auto transition-all duration-500 ${scrolled ? 'h-7' : 'h-8 sm:h-9'}`}
              />
            </a>

            {/* Desktop links */}
            <ul className="hidden items-center gap-4 text-[12.5px] xl:flex">
              {NAV_LINKS.map((l) =>
                l.active ? (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault()
                        go('top')
                      }}
                      className="relative font-medium text-white"
                    >
                      {l.label}
                      <span className="absolute -bottom-1.5 left-0 h-px w-full bg-gradient-to-r from-cy to-tl" />
                    </a>
                  </li>
                ) : (
                  <li key={l.label}>
                    <DisabledLink label={l.label} />
                  </li>
                ),
              )}
            </ul>

            {/* Actions */}
            <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
              <MagneticButton
                variant="outline"
                size="sm"
                strength={8}
                onClick={() => go('portfolio')}
              >
                See Our Work
              </MagneticButton>
              <MagneticButton variant="primary" size="sm" strength={8} onClick={() => go('quote')}>
                Get a Quote <Arrow size={14} />
              </MagneticButton>
              <CallPill className="hidden 2xl:inline-flex" />
            </div>

            {/* Mobile trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <CallPill compact />
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="relative grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5"
              >
                <span className="relative block h-3 w-4">
                  <motion.span
                    animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    className="absolute left-0 top-0 block h-[1.5px] w-4 bg-mist"
                  />
                  <motion.span
                    animate={open ? { opacity: 0 } : { opacity: 1 }}
                    className="absolute left-0 top-[5px] block h-[1.5px] w-4 bg-mist"
                  />
                  <motion.span
                    animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    className="absolute left-0 top-[10px] block h-[1.5px] w-4 bg-mist"
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[55] bg-ink-950/97 backdrop-blur-2xl lg:hidden"
          >
            <div className="grain absolute inset-0" />
            <div
              aria-hidden="true"
              className="absolute -right-24 top-10 h-72 w-72 animate-drift rounded-full bg-cy/20 blur-[90px]"
            />
            <div className="relative flex h-full flex-col justify-between px-6 pb-10 pt-28">
              <ul className="space-y-1">
                {NAV_LINKS.map((l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.055, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-white/6 py-3"
                  >
                    {l.active ? (
                      <a
                        href={l.href}
                        onClick={(e) => {
                          e.preventDefault()
                          go('top')
                        }}
                        className="flex items-center justify-between font-display text-2xl font-semibold text-white"
                      >
                        {l.label}
                        <span className="font-mono text-[10px] uppercase tracking-widest text-cy">
                          Live
                        </span>
                      </a>
                    ) : (
                      <span className="flex cursor-not-allowed items-center justify-between font-display text-2xl font-semibold text-mist/35">
                        {l.label}
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted/50">
                          Soon
                        </span>
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-3"
              >
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => go('quote')}
                >
                  Get a Quote <Arrow />
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href={BRAND.phoneHref}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Phone /> {BRAND.phone}
                </MagneticButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
