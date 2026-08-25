import { WHY_US } from '../lib/content.js'
import { scrollToId } from '../lib/hooks.js'
import { Stagger, TiltCard } from '../ui/Motion.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'
import { Arrow } from '../ui/Icons.jsx'

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cy/40 to-transparent"
      />
      <div className="shell relative">
        <SectionHeader
          eyebrow="Why us"
          lines={['Specialists, not', 'generalists.']}
          lede="The same crew, the same standards, whichever room you start with."
        />

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3" gap={0.1}>
          {WHY_US.map((item, i) => (
            <Stagger.Item key={item.title}>
              <TiltCard max={6} className="h-full rounded-2xl">
                <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-ink-800/70 p-7 transition-colors duration-500 hover:border-cy/30 sm:p-8">
                  {/* Hairline index — these read as a set, so the numbering is
                      just an ordinal marker, kept deliberately quiet. */}
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cy/70">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="display-md mt-4 text-white">{item.title}</h3>
                  <div className="my-5 h-px w-full bg-white/8" />
                  <p className="body-lg flex-1 text-mist/58">{item.body}</p>
                  <button
                    onClick={() => scrollToId('quote')}
                    className="mt-7 inline-flex items-center gap-2 self-start text-[13px] font-medium text-cy transition-transform duration-300 hover:translate-x-1"
                  >
                    Book a consultation <Arrow size={14} />
                  </button>
                </article>
              </TiltCard>
            </Stagger.Item>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
