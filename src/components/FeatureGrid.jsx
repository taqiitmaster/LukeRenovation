import { FEATURES } from '../lib/content.js'
import { Stagger } from '../ui/Motion.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'
import { DrawIcon, ICON_PATHS } from '../ui/Icons.jsx'

export default function FeatureGrid() {
  return (
    <section className="grain grain-light relative overflow-hidden bg-paper py-20 sm:py-28">
      <div className="shell relative">
        <SectionHeader
          theme="light"
          align="center"
          eyebrow="The standard"
          lines={['Six things we', 'never cut corners on.']}
        />

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" gap={0.07}>
          {FEATURES.map((f) => (
            <Stagger.Item key={f.title}>
              <article className="group h-full rounded-2xl border border-ink-900/8 bg-white/70 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-cy/45 hover:shadow-[0_28px_60px_-40px_rgba(11,15,20,.55)]">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-ink-900/10 bg-white text-ink-950 transition-colors duration-500 group-hover:border-cy/50 group-hover:text-cy">
                  <DrawIcon size={24}>{ICON_PATHS[f.icon]}</DrawIcon>
                </div>
                <h3 className="font-display text-lg font-semibold text-ink-950">{f.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-700/75">{f.body}</p>
              </article>
            </Stagger.Item>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
