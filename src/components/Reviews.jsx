import { REVIEWS } from '../lib/content.js'
import { CountUp, Reveal } from '../ui/Motion.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'
import { Star } from '../ui/Icons.jsx'

function GoogleMark({ size = 18 }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="#4285F4" d="M45 24c0-1.6-.1-2.7-.4-4H24v7.5h12c-.2 2-1.6 5-4.5 7l6.9 5.3C42.4 36.3 45 30.7 45 24z" />
      <path fill="#34A853" d="M24 46c6 0 11-2 14.4-5.3l-6.9-5.3C29.7 36.5 27.1 37.3 24 37.3c-5.8 0-10.7-3.9-12.5-9.1l-7.1 5.5C7.9 41 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.2c-.5-1.4-.7-2.8-.7-4.2s.3-2.9.7-4.2l-7.1-5.5C3 17.1 2 20.4 2 24s1 6.9 2.4 9.7l7.1-5.5z" />
      <path fill="#EA4335" d="M24 10.7c3.3 0 6.2 1.1 8.5 3.3l6.1-6.1C34.9 4.4 30 2 24 2 15.4 2 7.9 7 4.4 14.3l7.1 5.5c1.8-5.2 6.7-9.1 12.5-9.1z" />
    </svg>
  )
}

function ReviewCard({ review }) {
  return (
    <article className="w-[290px] shrink-0 rounded-2xl border border-ink-900/8 bg-white p-6 shadow-[0_18px_40px_-32px_rgba(11,15,20,.6)] sm:w-[340px]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cy to-tl font-display text-sm font-semibold text-ink-950">
          {review.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-ink-950">{review.name}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="flex text-amber" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} />
              ))}
            </span>
            <span className="font-mono text-[10px] text-ink-700/50">5.0</span>
          </div>
        </div>
        <GoogleMark />
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-ink-700/85">{review.text}</p>
    </article>
  )
}

/**
 * Seamless marquee: the list is rendered twice and translated -50%, so the
 * second copy lands exactly where the first began. Pure transform animation,
 * paused on hover and flattened for reduced-motion users by the global rule.
 */
function Marquee({ items, reverse = false, duration = 64 }) {
  return (
    <div className="edge-fade group relative overflow-hidden py-3">
      <div
        className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {[...items, ...items].map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} review={r} />
        ))}
      </div>
    </div>
  )
}

export default function Reviews() {
  const half = Math.ceil(REVIEWS.length / 2)
  return (
    <section className="grain grain-light relative overflow-hidden bg-paper py-20 sm:py-28">
      <div className="shell relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            theme="light"
            eyebrow="Social proof"
            lines={['Our Reviews.']}
            lede="Sydney homeowners, in their own words. Every review below is a verified Google review."
            className="lg:max-w-xl"
          />

          <Reveal delay={0.15}>
            <div className="glass-light flex items-center gap-5 rounded-2xl px-6 py-5">
              <GoogleMark size={30} />
              <div>
                <p className="font-display text-3xl font-bold leading-none text-ink-950">
                  <CountUp to={180} suffix="+" />
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="flex text-amber">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} />
                    ))}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-700/60">
                    Google reviews
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative mt-12 space-y-1">
        <Marquee items={REVIEWS.slice(0, half)} duration={62} />
        <Marquee items={REVIEWS.slice(half)} duration={74} reverse />
      </div>
    </section>
  )
}
