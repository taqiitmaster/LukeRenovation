import { KineticHeading, Reveal } from './Motion.jsx'

/**
 * Shared section opener: mono eyebrow, hairline, masked headline, lede.
 * Keeping this in one place is what makes the vertical rhythm consistent
 * down the whole page.
 */
export default function SectionHeader({
  eyebrow,
  lines,
  lede,
  theme = 'dark',
  align = 'left',
  className = '',
  size = 'display-lg',
}) {
  const dark = theme === 'dark'
  return (
    <div
      className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}
    >
      {eyebrow && (
        <Reveal className={`mb-5 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className={`h-px w-9 ${dark ? 'bg-cy' : 'bg-cy'}`} />
          <span className={`eyebrow ${dark ? 'text-cy' : 'text-ink-700'}`}>{eyebrow}</span>
        </Reveal>
      )}
      <KineticHeading
        lines={lines}
        className={`${size} ${dark ? 'text-white' : 'text-ink-950'}`}
      />
      {lede && (
        <Reveal delay={0.12}>
          <p
            className={`body-lg mt-5 max-w-2xl ${align === 'center' ? 'mx-auto' : ''} ${
              dark ? 'text-mist/65' : 'text-ink-700/80'
            }`}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  )
}
