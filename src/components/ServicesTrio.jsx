import { SERVICES } from '../lib/content.js'
import { scrollToId } from '../lib/hooks.js'
import { Stagger, TiltCard } from '../ui/Motion.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'
import { DrawIcon, ICON_PATHS, Arrow } from '../ui/Icons.jsx'
import { GridLines } from '../ui/Atmosphere.jsx'

export default function ServicesTrio() {
  return (
    <section id="services" className="relative overflow-hidden bg-ink-900 py-20 sm:py-28">
      <GridLines />
      <div className="shell relative">
        <SectionHeader
          eyebrow="What we do"
          lines={['Three trades,', 'one accountable team.']}
          lede="No juggling separate contractors. We scope the work, price it once, and run it start to finish."
        />

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3" gap={0.1}>
          {SERVICES.map((s) => (
            <Stagger.Item key={s.key}>
              <TiltCard className="h-full rounded-2xl">
                <article className="glass relative flex h-full flex-col rounded-2xl p-7 transition-colors duration-500 hover:border-cy/35 sm:p-8">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cy">
                    <DrawIcon size={26}>{ICON_PATHS[s.key]}</DrawIcon>
                  </div>
                  <h3 className="display-md text-white">{s.title}</h3>
                  <p className="body-lg mt-3 flex-1 text-mist/62">{s.body}</p>
                  <button
                    onClick={() => scrollToId('quote')}
                    className="mt-7 inline-flex items-center gap-2 self-start text-[13px] font-medium text-cy"
                  >
                    <span className="relative">
                      Get a fixed quote
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-cy transition-all duration-500 group-hover:w-full" />
                    </span>
                    <Arrow size={14} />
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
