import { BRAND } from '../lib/content.js'
import { scrollToId } from '../lib/hooks.js'
import MagneticButton from '../ui/Button.jsx'
import { Aurora, GridLines } from '../ui/Atmosphere.jsx'
import { KineticHeading, Reveal } from '../ui/Motion.jsx'
import { Arrow, Phone } from '../ui/Icons.jsx'

export default function FinalCTA() {
  return (
    <section className="grain relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <Aurora variant="mixed" />
      <GridLines />
      <div className="shell relative text-center">
        <KineticHeading
          lines={['Ready to Renovate?', <span key="l" className="text-gradient">Let&rsquo;s Talk.</span>]}
          className="display-xl mx-auto max-w-4xl text-white"
        />
        <Reveal delay={0.14}>
          <p className="body-lg mx-auto mt-7 max-w-xl text-mist/65">
            Tell us about the room. We&rsquo;ll come back with a fixed price, a scope you can
            actually read, and the next start date we have open.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticButton
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => scrollToId('quote')}
            >
              Get a Quote <Arrow />
            </MagneticButton>
            <MagneticButton
              as="a"
              href={BRAND.phoneHref}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Phone /> Call {BRAND.phone}
            </MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted/60">
            Licensed &amp; insured · Sydney wide
          </p>
        </Reveal>
      </div>
    </section>
  )
}
