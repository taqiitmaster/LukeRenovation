import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { IMG } from '../lib/images.js'
import { scrollToId } from '../lib/hooks.js'
import Img from '../ui/Img.jsx'
import MagneticButton from '../ui/Button.jsx'
import { KineticHeading, Reveal } from '../ui/Motion.jsx'
import { Arrow } from '../ui/Icons.jsx'

export default function DesignService() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // Gentle counter-scroll inside the frame.
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-7%', '7%'])
  const frame = useTransform(scrollYProgress, [0, 0.5], reduce ? [0, 0] : [40, 0])

  return (
    <section ref={ref} className="grain grain-light relative overflow-hidden bg-paper py-20 sm:py-28">
      <div className="shell relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Photo with a floating accent frame */}
        <div className="relative">
          <motion.div
            style={{ x: frame, y: frame }}
            className="pointer-events-none absolute -bottom-5 -right-5 h-full w-full rounded-2xl border border-cy/45 sm:-bottom-7 sm:-right-7"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-2xl bg-ink-800 shadow-[0_40px_90px_-50px_rgba(11,15,20,.7)]">
            <motion.div style={{ y }} className="scale-110">
              <Img
                image={IMG.kitchenIsland}
                alt="Kitchen renovation with a stone-topped island and teal overhead cabinetry"
                ratio="4 / 3"
                sizes="(min-width: 1024px) 48vw, 92vw"
                className="h-full w-full"
              />
            </motion.div>
          </div>

          <Reveal
            delay={0.2}
            className="glass-light absolute -bottom-6 left-5 rounded-xl px-4 py-3 sm:left-8"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-700/70">
              Design · Manufacture · Install
            </p>
            <p className="mt-1 font-display text-sm font-semibold text-ink-950">
              Managed end to end
            </p>
          </Reveal>
        </div>

        {/* Copy */}
        <div className="lg:pl-4">
          <Reveal className="mb-5 flex items-center gap-3">
            <span className="h-px w-9 bg-cy" />
            <span className="eyebrow text-ink-700">Full service</span>
          </Reveal>

          <KineticHeading
            lines={['Full Kitchen &', 'Bathroom Design and', 'Renovation Service']}
            className="font-display text-[clamp(1.85rem,3.5vw,2.9rem)] font-bold leading-[1.0] tracking-tightest text-ink-950"
          />

          <Reveal delay={0.1}>
            <p className="body-lg mt-6 text-ink-700/85">
              We undertake all types of bathroom &amp; kitchen renovations. We work in private
              homes, home units and apartments. The work time frame can vary but the results
              always speak for themselves!
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="body-lg mt-4 text-ink-700/85">
              At Luke&rsquo;s Renovations we offer you a fully managed service where we oversee
              the design, planning, manufacture &amp; installation of your entire bathroom or
              kitchen — completed to your satisfaction.
            </p>
          </Reveal>

          <Reveal delay={0.26} className="mt-9">
            <MagneticButton
              variant="ghostLight"
              size="lg"
              onClick={() => scrollToId('portfolio')}
            >
              View Projects <Arrow />
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
