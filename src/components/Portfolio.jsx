import { PROJECTS } from '../lib/content.js'
import BeforeAfter from './BeforeAfter.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'
import { Reveal, Stagger } from '../ui/Motion.jsx'
import { Aurora } from '../ui/Atmosphere.jsx'
import { Arrow } from '../ui/Icons.jsx'

export default function Portfolio() {
  return (
    <section id="portfolio" className="grain relative overflow-hidden bg-ink-950 py-20 sm:py-28">
      <Aurora variant="mixed" />
      <div className="shell relative">
        <SectionHeader
          eyebrow="Portfolio"
          lines={['See The', 'Transformation.']}
          lede="Drag to reveal the after. Three real Sydney jobs, photographed before demolition and on handover day."
        />

        <Stagger className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-6" gap={0.12} amount={0.15}>
          {PROJECTS.map((p, i) => (
            <Stagger.Item key={p.id}>
              <BeforeAfter project={p} index={i} />
            </Stagger.Item>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-14 flex justify-center">
          {/* Demo build — the full portfolio page doesn't exist yet. */}
          <span
            aria-disabled="true"
            title="Coming soon"
            className="group inline-flex cursor-not-allowed items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-sm text-mist/55"
          >
            View Full Portfolio
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            <span className="ml-1 font-mono text-[10px] uppercase tracking-widest text-muted/60">
              Coming soon
            </span>
          </span>
        </Reveal>
      </div>
    </section>
  )
}
