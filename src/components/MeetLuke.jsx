import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { LOGO_LIGHT } from '../lib/images.js'
import { CountUp, Reveal } from '../ui/Motion.jsx'
import { useReveal } from '../lib/hooks.js'
import Img from '../ui/Img.jsx'

/**
 * ── DROPPING IN THE REAL PHOTO ────────────────────────────────────────────
 * No team shot came with the asset set, so this renders a designed slot at the
 * correct 4:5 ratio rather than a broken frame. To swap in the real one:
 *
 *   1. save the photo to  src/assets/images/team.jpg
 *   2. add it to src/lib/images.js the same way the others are imported
 *   3. pass it here:      <TeamPhoto image={IMG.team} />
 *
 * Everything else — the frame, parallax, hover caption — stays as is.
 */
function TeamPhoto({ image }) {
  if (image) {
    return (
      <Img
        image={image}
        alt="Luke and the Luke's Renovations crew on site in Sydney"
        ratio="4 / 5"
        sizes="(min-width: 1024px) 44vw, 92vw"
        className="h-full w-full"
      />
    )
  }

  return (
    <div className="grain relative aspect-[4/5] w-full overflow-hidden bg-ink-900">
      <div
        aria-hidden="true"
        className="absolute -left-1/4 top-0 h-[70%] w-[90%] animate-drift rounded-full bg-cy/18 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-1/4 bottom-0 h-[60%] w-[80%] animate-drift-slow rounded-full bg-amber/12 blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
        <img src={LOGO_LIGHT} alt="" width={350} height={90} className="h-9 w-auto opacity-70" />
        <p className="max-w-[15rem] text-sm leading-relaxed text-mist/45">
          Team photograph to be supplied by the client.
        </p>
        <span className="rounded-full border border-white/12 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
          4:5 portrait
        </span>
      </div>
    </div>
  )
}

const STATS = [
  { value: 10, suffix: '+', label: 'Years on the tools' },
  { value: 1, suffix: '', label: 'Managed crew, start to finish', display: 'One' },
  { value: 180, suffix: '+', label: '5★ Google reviews' },
]

export default function MeetLuke({ teamImage }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%'])
  const frameShift = useTransform(scrollYProgress, [0, 0.6], reduce ? [0, 0] : [34, 0])
  const [headingRef, headingInView] = useReveal({ amount: 0.4 })

  return (
    <section ref={ref} className="grain grain-light relative overflow-hidden bg-chalk py-20 sm:py-28">
      <div className="shell relative grid items-center gap-14 lg:grid-cols-[0.95fr_1fr] lg:gap-16">
        {/* Photo */}
        <div className="group relative">
          <motion.span
            aria-hidden="true"
            style={{ x: frameShift, y: frameShift }}
            className="pointer-events-none absolute -bottom-5 -left-5 h-full w-full rounded-2xl border border-amber/50 sm:-bottom-7 sm:-left-7"
          />
          <div className="relative overflow-hidden rounded-2xl shadow-[0_50px_100px_-60px_rgba(11,15,20,.8)]">
            <motion.div style={{ y }} className="scale-105">
              <TeamPhoto image={teamImage} />
            </motion.div>

            {/* Hover caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-ink-950/90 to-transparent p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cy">
                Luke &amp; the crew, on-site in Sydney
              </p>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div>
          <Reveal className="mb-5 flex items-center gap-3">
            <span className="h-px w-9 bg-amber" />
            <span className="eyebrow text-ink-700">The people</span>
          </Reveal>

          {/* Heading is written out rather than passed to <KineticHeading> so the
              signature stroke can be anchored to the word "Luke" itself and
              travel with it at any type size. */}
          <h2 ref={headingRef} className="display-lg text-ink-950">
            {[
              <>
                Meet{' '}
                <span className="relative inline-block">
                  Luke
                  <motion.svg
                    viewBox="0 0 180 20"
                    preserveAspectRatio="none"
                    className="absolute -bottom-[0.06em] left-0 h-[0.22em] w-full text-amber"
                    fill="none"
                    aria-hidden="true"
                    initial={reduce ? false : 'hidden'}
                    animate={headingInView || reduce ? 'show' : 'hidden'}
                  >
                    <motion.path
                      d="M4 13C36 4 70 3 100 8c22 3.6 45 6 76 2"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      variants={{
                        hidden: { pathLength: 0, opacity: 0 },
                        show: {
                          pathLength: 1,
                          opacity: 1,
                          transition: { duration: 0.9, delay: 0.5, ease: 'easeOut' },
                        },
                      }}
                    />
                  </motion.svg>
                </span>{' '}
                &amp;
              </>,
              'The Team.',
            ].map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.12em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: '110%' }}
                  animate={headingInView || reduce ? { y: '0%' } : { y: '110%' }}
                  transition={{ duration: 0.9, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <Reveal delay={0.12}>
            <p className="body-lg mt-6 max-w-xl text-ink-700/85">
              Behind every Luke&rsquo;s Renovations project is one experienced, hands-on crew —
              not a rotating cast of subcontractors. Luke personally manages each job from
              demolition to handover, so you always know who&rsquo;s in your home and who&rsquo;s
              accountable for the finish. Local, licensed and genuinely proud of the work we
              leave behind.
            </p>
          </Reveal>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-ink-900/10 pt-8">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={0.1 + i * 0.1}>
                <p className="font-display text-3xl font-bold leading-none text-ink-950 sm:text-4xl">
                  {s.display ? (
                    s.display
                  ) : (
                    <CountUp to={s.value} suffix={s.suffix} duration={1400} />
                  )}
                </p>
                <p className="mt-2 text-[12px] leading-snug text-ink-700/65">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
