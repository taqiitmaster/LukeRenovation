import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND } from '../lib/content.js'
import { LOGO_LIGHT } from '../lib/images.js'
import { scrollToId } from '../lib/hooks.js'
import { Phone, Arrow } from '../ui/Icons.jsx'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | error | done

  const send = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState('error')
    setState('done') // Demo build — nothing is sent.
  }

  return (
    <div className="border-y border-white/8 py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-white">
            Renovation tips, straight from site
          </p>
          <p className="mt-1.5 text-sm text-mist/55">
            Occasional notes on planning, budgeting and what actually lasts.
          </p>
        </div>

        <div className="w-full lg:w-[420px]">
          <AnimatePresence mode="wait" initial={false}>
            {state === 'done' ? (
              <motion.p
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 rounded-full border border-cy/40 bg-cy/10 px-5 py-3.5 text-sm text-cy"
              >
                <motion.svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  initial="hidden"
                  animate="show"
                >
                  <motion.path
                    d="M5 12.5 10 17.5 19.5 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                      hidden: { pathLength: 0 },
                      show: { pathLength: 1, transition: { duration: 0.45 } },
                    }}
                  />
                </motion.svg>
                Thanks, we&rsquo;ll be in touch
              </motion.p>
            ) : (
              <motion.form
                key="form"
                onSubmit={send}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2"
              >
                <label htmlFor="newsletter" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setState('idle')
                  }}
                  placeholder="you@example.com"
                  className={`h-12 flex-1 rounded-full border bg-white/[0.03] px-5 text-sm text-mist placeholder:text-muted/55 focus:outline-none ${
                    state === 'error' ? 'border-amber' : 'border-white/12 focus:border-cy'
                  }`}
                />
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-full bg-cy px-6 text-sm font-semibold text-ink-950 transition-transform duration-300 hover:scale-[1.03]"
                >
                  Send
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          {state === 'error' && (
            <p className="mt-2 pl-5 text-[12px] text-amber">
              Enter an email address so we know where to write.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const Col = ({ title, children }) => (
  <div>
    <p className="eyebrow mb-4 text-cy">{title}</p>
    <div className="space-y-2.5 text-sm text-mist/60">{children}</div>
  </div>
)

export default function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-ink-950 pt-16">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cy/50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 animate-drift-slow rounded-full bg-cy/8 blur-[130px]"
      />

      <div className="shell relative">
        {/* Brand lockup */}
        <div className="flex flex-col gap-6 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <img src={LOGO_LIGHT} alt={BRAND.name} width={350} height={90} className="h-10 w-auto" />
          <p className="max-w-sm text-sm leading-relaxed text-mist/50">
            Renovating bathrooms, kitchens and whole homes across Sydney since 2014.
          </p>
        </div>

        <Newsletter />

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <Col title="About">
            <p className="leading-relaxed">
              Complete bathroom, kitchen, laundry and home renovations across Sydney. One
              experienced team manages the job from demolition through to handover.
            </p>
          </Col>

          <Col title="Information">
            <p className="leading-relaxed">{BRAND.address}</p>
            <a
              href={`mailto:${BRAND.email}`}
              className="inline-block break-all transition-colors hover:text-cy"
            >
              {BRAND.email}
            </a>
          </Col>

          <Col title="Quick links">
            <span
              aria-disabled="true"
              title="Coming soon"
              className="block cursor-not-allowed text-mist/35"
            >
              Bathroom Renovations Sydney
            </span>
            <button
              onClick={() => scrollToId('quote')}
              className="group flex items-center gap-1.5 transition-colors hover:text-cy"
            >
              Get a Quote
              <Arrow size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </Col>

          <Col title="Let's connect">
            <a
              href={BRAND.phoneHref}
              className="inline-flex items-center gap-2 text-lg font-semibold text-white transition-colors hover:text-cy"
            >
              <Phone size={17} /> {BRAND.phone}
            </a>
            <p className="text-[13px] text-mist/45">Mon–Sat, 7am–5pm</p>
          </Col>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/8 py-7 text-[12px] text-muted/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-[0.16em]">
            Concept redesign · Home page demo
          </p>
        </div>
      </div>
    </footer>
  )
}
