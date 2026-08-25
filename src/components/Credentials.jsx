import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { CREDENTIALS } from '../lib/content.js'
import { IMG } from '../lib/images.js'
import { scrollToId, useReveal } from '../lib/hooks.js'
import Img from '../ui/Img.jsx'
import MagneticButton from '../ui/Button.jsx'
import { KineticHeading, Reveal } from '../ui/Motion.jsx'
import { CheckDraw, Arrow } from '../ui/Icons.jsx'

export default function Credentials() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-9%', '9%'])
  const [listRef, listInView] = useReveal({ amount: 0.25 })

  return (
    <section ref={ref} className="grain relative overflow-hidden bg-ink-950 py-20 sm:py-28">
      {/* Dimmed parallax backdrop */}
      <motion.div style={{ y }} className="absolute inset-0 scale-125">
        <Img
          image={IMG.p1after}
          alt=""
          ratio="auto"
          sizes="100vw"
          className="h-full w-full"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(100deg,rgba(7,10,14,.97)_0%,rgba(7,10,14,.9)_46%,rgba(7,10,14,.72)_100%)]"
      />

      <div className="shell relative z-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal className="mb-5 flex items-center gap-3">
            <span className="h-px w-9 bg-cy" />
            <span className="eyebrow text-cy">Credentials</span>
          </Reveal>
          <KineticHeading lines={["Luke's", 'Renovations.']} className="display-lg text-white" />
          <Reveal delay={0.12}>
            <p className="body-lg mt-6 max-w-lg text-mist/70">
              At Luke&rsquo;s Renovations, we&rsquo;re dedicated to bringing your vision to life.
              Whether it&rsquo;s a bathroom or kitchen renovation in Sydney, our team combines
              expertise with personalised attention to deliver exceptional results.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-9">
            <MagneticButton variant="primary" size="lg" onClick={() => scrollToId('quote')}>
              Get a Fixed Quote <Arrow />
            </MagneticButton>
          </Reveal>
        </div>

        {/* Checklist — each row ticks itself in */}
        <motion.ul
          ref={listRef}
          initial={reduce ? false : 'hidden'}
          animate={listInView || reduce ? 'show' : 'hidden'}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11 } } }}
          className="glass self-start rounded-2xl p-2 sm:p-3"
        >
          {CREDENTIALS.map((c) => (
            <motion.li
              key={c}
              variants={{
                hidden: { opacity: 0, x: 18 },
                show: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="flex items-center gap-4 border-b border-white/6 px-4 py-4 last:border-b-0 sm:px-5"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-cy/40 bg-cy/10 text-cy">
                <CheckDraw size={16} />
              </span>
              <span className="text-[15px] font-medium text-mist/90">{c}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
