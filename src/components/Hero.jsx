import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { BRAND, TRUST_PILLS } from '../lib/content.js'
import { IMG } from '../lib/images.js'
import { scrollToId } from '../lib/hooks.js'
import Img from '../ui/Img.jsx'
import MagneticButton from '../ui/Button.jsx'
import { Aurora } from '../ui/Atmosphere.jsx'
import { KineticHeading } from '../ui/Motion.jsx'
import { Arrow, Phone } from '../ui/Icons.jsx'

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Photo drifts slower than the page; copy lifts away and fades.
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, reduce ? 1 : 0])

  return (
    <section
      id="top"
      ref={ref}
      className="grain relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-950 pb-12 pt-32 sm:pb-16 lg:min-h-screen lg:justify-center lg:pb-28 lg:pt-36"
    >
      {/* Photography */}
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <Img
          image={IMG.bathroomVanity}
          alt="Completed bathroom renovation in Sydney with a fluted timber vanity and stone benchtop"
          ratio="auto"
          priority
          sizes="100vw"
          position="center 52%"
          className="h-full w-full"
        />
      </motion.div>

      {/* Cinematic grade over the photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,14,.82)_0%,rgba(7,10,14,.34)_36%,rgba(7,10,14,.68)_74%,#0B0F14_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_62%_75%_at_10%_50%,rgba(7,10,14,.92),rgba(7,10,14,.45)_55%,transparent_75%)]"
      />
      <Aurora variant="cyan" />

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="shell relative z-10">
        <div className="max-w-4xl">
          {/* Eyebrow reads like a drawing annotation — sets the engineered register. */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-cy" />
            <span className="eyebrow text-cy">Sydney · Est. 2014</span>
          </motion.div>

          <KineticHeading
            as="h1"
            delay={0.25}
            className="display-xl text-white"
            lines={['Sydney Bathroom,', 'Kitchen & Home', <span key="g" className="text-gradient">Renovations</span>]}
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="body-lg mt-7 max-w-2xl text-mist/72"
          >
            One trusted crew for bathrooms, kitchens and complete home renovations across
            Sydney. Clear scopes, fixed pricing and hands-on project management from demolition
            to handover. Most standard bathrooms are completed in around two weeks.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <MagneticButton variant="primary" size="lg" onClick={() => scrollToId('quote')}>
              Get a Price Guide &amp; Start Dates <Arrow />
            </MagneticButton>
            <MagneticButton variant="outline" size="lg" onClick={() => scrollToId('portfolio')}>
              See Our Work
            </MagneticButton>
            <a
              href={BRAND.phoneHref}
              className="mt-1 inline-flex items-center gap-2 text-sm text-mist/70 transition-colors hover:text-cy sm:ml-2 sm:mt-0"
            >
              <Phone size={15} /> {BRAND.phone}
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {TRUST_PILLS.map((p, i) => (
              <motion.li
                key={p}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + i * 0.08 }}
                className="glass rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mist/80 sm:text-[11px]"
              >
                {p}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollToId('services')}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{ opacity: copyOpacity }}
        aria-label="Scroll to services"
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="eyebrow text-muted/70">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            animate={{ y: ['-100%', '160%'] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-x-0 top-0 block h-4 bg-cy"
          />
        </span>
      </motion.button>
    </section>
  )
}
