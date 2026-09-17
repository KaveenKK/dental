'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Stage = 'idle' | 'scanning' | 'result'

type Trait = {
  label: string
  score: number
  note: string
}

const TRAITS: Trait[] = [
  { label: 'Facial harmony', score: 82, note: 'Strong overall proportion balance' },
  { label: 'Symmetry', score: 74, note: 'Minor asymmetry in lower third' },
  { label: 'Jawline definition', score: 68, note: 'Room to sharpen the gonial angle' },
  { label: 'Skin quality', score: 71, note: 'Even tone, some texture to refine' },
  { label: 'Canthal tilt', score: 79, note: 'Positive tilt, naturally photogenic' },
]

const SCAN_STEPS = [
  'Detecting 68 facial landmarks',
  'Measuring thirds & fifths proportions',
  'Analyzing symmetry deviation',
  'Scoring harmony against clinical norms',
  'Building your personalized plan',
]

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, duration])
  return value
}

function ScoreRing({ score, run }: { score: number; run: boolean }) {
  const display = useCountUp(score, run)
  const r = 78
  const c = 2 * Math.PI * r
  const offset = c - (display / 100) * c
  return (
    <div className="relative grid h-48 w-48 place-items-center">
      <svg className="h-48 w-48 -rotate-90" viewBox="0 0 180 180" aria-hidden>
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-5xl font-medium tracking-tight text-brand-strong">
          {display}
        </span>
        <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  )
}

function TraitBar({ trait, run, delay }: { trait: Trait; run: boolean; delay: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground/90">{trait.label}</span>
        <span className="font-mono text-xs text-muted-foreground">{trait.score}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-brand"
          style={{
            width: run ? `${trait.score}%` : '0%',
            transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
          }}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{trait.note}</p>
    </div>
  )
}

export function FacialAnalyzer() {
  const [stage, setStage] = useState<Stage>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [scanStep, setScanStep] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const overall = 76

  const runScan = useCallback(() => {
    setStage('scanning')
    setScanStep(0)
    let step = 0
    const id = setInterval(() => {
      step += 1
      if (step >= SCAN_STEPS.length) {
        clearInterval(id)
        setStage('result')
      } else {
        setScanStep(step)
      }
    }, 620)
  }, [])

  const handleFile = useCallback(
    (file?: File) => {
      if (!file) return
      const url = URL.createObjectURL(file)
      setPreview(url)
      runScan()
    },
    [runScan],
  )

  const reset = () => {
    setStage('idle')
    setPreview(null)
  }

  return (
    <section id="analyze" className="scroll-mt-24 px-4 py-24 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft/40 px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-brand-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            FREE FACIAL ANALYSIS
          </span>
          <h2 className="mt-6 text-balance text-4xl font-medium tracking-tight sm:text-5xl">
            Get your attractiveness score in seconds
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Upload a front-facing photo and our clinical model maps 68 landmarks to
            score your facial harmony — then builds a personalized improvement plan.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-[0_1px_0_rgba(0,0,0,0.02),0_24px_60px_-30px_rgba(20,60,70,0.35)]">
          <div className="grid md:grid-cols-2">
            {/* Left: photo / dropzone */}
            <div className="relative border-b border-border bg-gradient-to-br from-brand-soft/40 to-secondary/60 p-6 md:border-b-0 md:border-r sm:p-8">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview || '/placeholder.svg'}
                    alt="Your uploaded portrait for analysis"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/portrait-3.png"
                    alt="Example portrait for facial analysis"
                    className="h-full w-full object-cover opacity-90"
                  />
                )}

                {stage === 'scanning' && (
                  <div className="absolute inset-0">
                    <div className="scan-line absolute inset-x-0 h-0.5 bg-brand shadow-[0_0_16px_2px_var(--brand)]" />
                    <div className="absolute inset-0 bg-brand-strong/10" />
                  </div>
                )}

                {stage !== 'scanning' && (
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="border border-brand/20" />
                    ))}
                  </div>
                )}
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {stage === 'idle' && (
                <button
                  onClick={() => inputRef.current?.click()}
                  className="mt-5 w-full rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
                >
                  Upload your photo
                </button>
              )}
              {stage === 'result' && (
                <button
                  onClick={reset}
                  className="mt-5 w-full rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Analyze another photo
                </button>
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Processed privately. Photos are never stored or shared.
              </p>
            </div>

            {/* Right: results */}
            <div className="p-6 sm:p-8">
              {stage === 'idle' && (
                <div className="flex h-full flex-col justify-center gap-5">
                  <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                    WHAT YOU&apos;LL GET
                  </p>
                  <ul className="space-y-4">
                    {[
                      'An overall harmony score out of 100',
                      'A breakdown across 5 clinical dimensions',
                      'Your top 3 highest-impact opportunities',
                      'A personalized, non-surgical action plan',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/12 text-brand-strong">
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path d="M2.5 6.2l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="text-sm text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {stage === 'scanning' && (
                <div className="flex h-full min-h-[320px] flex-col justify-center gap-4">
                  {SCAN_STEPS.map((label, i) => {
                    const active = i === scanStep
                    const done = i < scanStep
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] transition-colors ${
                            done
                              ? 'bg-brand text-primary-foreground'
                              : active
                                ? 'bg-brand/20 text-brand-strong'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {done ? '✓' : i + 1}
                        </span>
                        <span
                          className={`text-sm transition-colors ${
                            active || done ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {label}
                          {active && <span className="ml-1 animate-pulse">…</span>}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {stage === 'result' && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-6">
                    <ScoreRing score={overall} run />
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                        OVERALL HARMONY
                      </p>
                      <p className="mt-1 text-2xl font-medium text-foreground">
                        Above average
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Top 28% — with 3 high-impact areas to refine.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {TRAITS.map((t, i) => (
                      <TraitBar key={t.label} trait={t} run delay={i * 120} />
                    ))}
                  </div>
                  <a
                    href="#plan"
                    className="mt-1 w-full rounded-full bg-brand px-6 py-3.5 text-center text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
                  >
                    Unlock my full personalized plan
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-center text-xs text-muted-foreground">
          Scores are an aesthetic guide based on facial-proportion research, not a
          medical diagnosis.
        </p>
      </div>
    </section>
  )
}
