import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PROJECT_TYPES, TIMEFRAMES } from '../lib/content.js'
import { burstConfetti } from '../lib/confetti.js'
import MagneticButton from '../ui/Button.jsx'
import { Aurora } from '../ui/Atmosphere.jsx'
import { KineticHeading, Reveal } from '../ui/Motion.jsx'
import { Arrow } from '../ui/Icons.jsx'

const STEPS = [
  { id: 1, label: 'Project type' },
  { id: 2, label: 'Timeframe' },
  { id: 3, label: 'Details' },
  { id: 4, label: 'Confirm' },
]

const EASE = [0.16, 1, 0.3, 1]

/** Big tappable option card. Real radio semantics under a custom skin. */
function OptionCard({ selected, onSelect, title, sub, className = '' }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-xl border p-5 text-left transition-all duration-300 ${
        selected
          ? 'border-cy bg-cy/10 shadow-[0_0_0_1px_rgba(34,211,238,.4),0_18px_40px_-24px_rgba(34,211,238,.7)]'
          : 'border-white/12 bg-white/[0.03] hover:border-white/28 hover:bg-white/[0.06]'
      } ${className}`}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block font-display text-lg font-semibold text-white">{title}</span>
          {sub && <span className="mt-1 block text-[13px] text-mist/55">{sub}</span>}
        </span>
        <span
          aria-hidden="true"
          className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
            selected ? 'border-cy bg-cy' : 'border-white/25'
          }`}
        >
          {selected && (
            <motion.svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              <path
                d="M5 12.5 10 17.5 19.5 7"
                fill="none"
                stroke="#0B0F14"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </span>
      </span>
    </button>
  )
}

/** Drag-and-drop photo zone. Front-end only — nothing leaves the browser. */
function PhotoDrop({ files, setFiles }) {
  const [over, setOver] = useState(false)
  const inputRef = useRef(null)

  const add = (list) => {
    const picked = Array.from(list)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 4 - files.length)
    setFiles((prev) => [
      ...prev,
      ...picked.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
    ])
  }

  /**
   * Object URLs are revoked on unmount so the demo doesn't leak blobs. The
   * live list is held in a ref rather than closed over from `files` — an
   * effect keyed on `files` would run its cleanup on every add and revoke the
   * previous previews out from under the thumbnails.
   */
  const liveUrls = useRef([])
  liveUrls.current = files.map((f) => f.url)
  useEffect(() => () => liveUrls.current.forEach((url) => URL.revokeObjectURL(url)), [])

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          add(e.dataTransfer.files)
        }}
        className={`rounded-xl border border-dashed p-6 text-center transition-colors duration-300 ${
          over ? 'border-cy bg-cy/10' : 'border-white/18 bg-white/[0.02]'
        }`}
      >
        <p className="text-sm text-mist/70">Drag photos of your space here</p>
        <p className="mt-1 text-[12px] text-muted/70">or</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 rounded-full border border-white/20 px-4 py-2 text-[13px] text-mist transition-colors hover:border-cy hover:text-cy"
        >
          Choose files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            add(e.target.files)
            e.target.value = ''
          }}
        />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted/50">
          Up to 4 · stays on your device
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-3">
          {files.map((f, i) => (
            <motion.li
              key={f.url}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/12"
            >
              <img src={f.url} alt={f.name} className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => {
                  URL.revokeObjectURL(f.url)
                  setFiles((prev) => prev.filter((_, idx) => idx !== i))
                }}
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink-950/80 text-[11px] text-mist"
              >
                ×
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function QuoteWizard() {
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [type, setType] = useState(null)
  const [timeframe, setTimeframe] = useState(null)
  const [details, setDetails] = useState('')
  const [files, setFiles] = useState([])
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const canvasRef = useRef(null)
  const panelRef = useRef(null)
  const reduce = useReducedMotion()

  const go = (next) => {
    setDir(next > step ? 1 : -1)
    setError('')
    setStep(next)
  }

  const next = () => {
    if (step === 1 && !type) return setError('Pick a project type to continue.')
    if (step === 2 && !timeframe) return setError('Let us know your timing to continue.')
    go(step + 1)
  }

  const submit = () => {
    setSent(true)
    // Demo build — nothing is transmitted anywhere.
    requestAnimationFrame(() => burstConfetti(canvasRef.current))
  }

  const reset = () => {
    setSent(false)
    setStep(1)
    setType(null)
    setTimeframe(null)
    setDetails('')
    setFiles([])
  }

  // Slide direction follows navigation direction.
  const variants = {
    enter: (d) => (reduce ? { opacity: 0 } : { x: d * 48, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => (reduce ? { opacity: 0 } : { x: d * -48, opacity: 0 }),
  }

  const selectedType = PROJECT_TYPES.find((p) => p.id === type)

  return (
    <section id="quote" className="grain relative overflow-hidden bg-ink-900 py-20 sm:py-28">
      <Aurora variant="mixed" />
      <div className="shell relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-amber" />
            <span className="eyebrow text-amber">Free · no obligation</span>
          </Reveal>
          <KineticHeading
            lines={['Get a Fixed Bathroom Quote', '+ Timeline in 24 Hours.']}
            className="display-lg text-white"
          />
          <Reveal delay={0.12}>
            <p className="body-lg mx-auto mt-5 max-w-xl text-mist/62">
              Four quick questions. We come back with a fixed price and the next available
              start date.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
          <div ref={panelRef} className="glass relative overflow-hidden rounded-3xl p-6 sm:p-9">
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 h-full w-full"
            />

            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="relative z-10 py-8 text-center"
                >
                  <motion.svg
                    viewBox="0 0 52 52"
                    className="mx-auto h-16 w-16 text-cy"
                    fill="none"
                    initial="hidden"
                    animate="show"
                  >
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="23"
                      stroke="currentColor"
                      strokeWidth="2"
                      variants={{
                        hidden: { pathLength: 0, opacity: 0 },
                        show: {
                          pathLength: 1,
                          opacity: 1,
                          transition: { duration: 0.7, ease: 'easeOut' },
                        },
                      }}
                    />
                    <motion.path
                      d="M15 27l8 8 15-16"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={{
                        hidden: { pathLength: 0 },
                        show: {
                          pathLength: 1,
                          transition: { duration: 0.45, delay: 0.5, ease: 'easeOut' },
                        },
                      }}
                    />
                  </motion.svg>

                  <h3 className="display-md mt-6 text-white">Request received</h3>
                  <p className="body-lg mx-auto mt-3 max-w-sm text-mist/65">
                    We&rsquo;ll be in touch within 24 hours with a fixed price and start dates.
                  </p>
                  <button
                    onClick={reset}
                    className="mt-8 text-[13px] text-cy underline underline-offset-4"
                  >
                    Start another estimate
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" className="relative z-10">
                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex items-baseline justify-between">
                      <p className="font-display text-sm font-medium text-white">
                        {STEPS[step - 1].label}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cy">
                        Step {step} of 4
                      </p>
                    </div>
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cy to-tl"
                        animate={{ width: `${(step / 4) * 100}%` }}
                        transition={{ duration: 0.6, ease: EASE }}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.38, ease: EASE }}
                    >
                      {step === 1 && (
                        <div role="radiogroup" aria-label="Project type" className="grid gap-3">
                          {PROJECT_TYPES.map((p) => (
                            <OptionCard
                              key={p.id}
                              title={p.title}
                              sub={p.range}
                              selected={type === p.id}
                              onSelect={() => {
                                setType(p.id)
                                setError('')
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {step === 2 && (
                        <div
                          role="radiogroup"
                          aria-label="Timeframe"
                          className="grid gap-3 sm:grid-cols-2"
                        >
                          {TIMEFRAMES.map((t) => (
                            <OptionCard
                              key={t}
                              title={t}
                              selected={timeframe === t}
                              onSelect={() => {
                                setTimeframe(t)
                                setError('')
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-5">
                          <div>
                            <label
                              htmlFor="details"
                              className="mb-2 block text-sm font-medium text-white"
                            >
                              Tell us about your project
                            </label>
                            <textarea
                              id="details"
                              rows={5}
                              value={details}
                              onChange={(e) => setDetails(e.target.value)}
                              placeholder="Room size, what's staying, what you'd like changed, any tiles or tapware you've picked out…"
                              className="w-full resize-none rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-[15px] text-mist placeholder:text-muted/55 focus:border-cy focus:outline-none"
                            />
                          </div>
                          <PhotoDrop files={files} setFiles={setFiles} />
                        </div>
                      )}

                      {step === 4 && (
                        <dl className="divide-y divide-white/8 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                          {[
                            ['Project', selectedType ? `${selectedType.title} — ${selectedType.range}` : '—'],
                            ['Timing', timeframe ?? '—'],
                            ['Details', details.trim() || 'Nothing added'],
                            ['Photos', files.length ? `${files.length} attached` : 'None'],
                          ].map(([k, v]) => (
                            <div key={k} className="flex gap-4 px-5 py-4">
                              <dt className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted/70">
                                {k}
                              </dt>
                              <dd className="flex-1 text-[14px] text-mist/85">{v}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Validation message names the fix, not the failure. */}
                  <div aria-live="polite" className="min-h-[24px] pt-4">
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[13px] text-amber"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between gap-4">
                    {step > 1 ? (
                      <button
                        onClick={() => go(step - 1)}
                        className="text-[13px] text-mist/60 transition-colors hover:text-cy"
                      >
                        ← Back
                      </button>
                    ) : (
                      <span />
                    )}

                    {step < 4 ? (
                      <MagneticButton variant="primary" size="lg" onClick={next}>
                        {step === 1 ? 'Next: Start Timeframe' : 'Next'} <Arrow />
                      </MagneticButton>
                    ) : (
                      <MagneticButton variant="primary" size="lg" onClick={submit}>
                        Request My Estimate <Arrow />
                      </MagneticButton>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
