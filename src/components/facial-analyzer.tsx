'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Stage = 'idle' | 'scanning' | 'workspace'

type Treatment = {
  id: string
  name: string
  kind: 'Routine' | 'Product' | 'Procedure'
  delta: number
  filter?: Partial<FilterParts>
}

type Region = {
  id: string
  label: string
  score: number
  ceiling: number
  insight: string
  metric: string
  box: { x: number; y: number; w: number; h: number }
  treatments: Treatment[]
}

type FilterParts = {
  brightness: number
  contrast: number
  saturate: number
  sepia: number
}

const REGIONS: Region[] = [
  {
    id: 'brows',
    label: 'Brows & Forehead',
    score: 76,
    ceiling: 89,
    insight: 'Brow position sits slightly low; upper third reads shorter than ideal.',
    metric: 'Upper third · 31% (ideal 33%)',
    box: { x: 26, y: 12, w: 48, h: 16 },
    treatments: [
      { id: 'brow-lam', name: 'Brow lamination', kind: 'Routine', delta: 4 },
      { id: 'brow-tox', name: 'Brow-lift (neuromodulator)', kind: 'Procedure', delta: 6 },
    ],
  },
  {
    id: 'eyes',
    label: 'Eyes & Canthal Tilt',
    score: 79,
    ceiling: 92,
    insight: 'Positive canthal tilt — a strong feature. Mild under-eye hollowing.',
    metric: 'Canthal tilt · +5.4°',
    box: { x: 22, y: 30, w: 56, h: 12 },
    treatments: [
      { id: 'eye-cream', name: 'Peptide eye complex', kind: 'Product', delta: 3, filter: { brightness: 0.02 } },
      { id: 'tear-trough', name: 'Tear-trough filler', kind: 'Procedure', delta: 7, filter: { brightness: 0.03 } },
    ],
  },
  {
    id: 'nose',
    label: 'Nose',
    score: 74,
    ceiling: 88,
    insight: 'Dorsal hump breaks the profile line; tip projection within range.',
    metric: 'Nasofrontal angle · 128°',
    box: { x: 40, y: 38, w: 20, h: 22 },
    treatments: [
      { id: 'nose-nsr', name: 'Non-surgical rhinoplasty', kind: 'Procedure', delta: 8 },
      { id: 'nose-contour', name: 'Contour technique', kind: 'Routine', delta: 3 },
    ],
  },
  {
    id: 'skin',
    label: 'Skin & Texture',
    score: 71,
    ceiling: 90,
    insight: 'Uneven tone through the T-zone with visible texture on the cheeks.',
    metric: 'Evenness index · 0.71',
    box: { x: 16, y: 26, w: 68, h: 46 },
    treatments: [
      { id: 'skin-retinoid', name: 'Prescription retinoid', kind: 'Routine', delta: 6, filter: { brightness: 0.03, contrast: 0.03, saturate: 0.04 } },
      { id: 'skin-vitc', name: 'Vitamin C serum', kind: 'Product', delta: 4, filter: { saturate: 0.05, brightness: 0.02 } },
      { id: 'skin-resurf', name: 'In-clinic resurfacing', kind: 'Procedure', delta: 8, filter: { brightness: 0.04, contrast: 0.04 } },
    ],
  },
  {
    id: 'lips',
    label: 'Lips & Perioral',
    score: 73,
    ceiling: 86,
    insight: 'Upper-to-lower lip ratio slightly thin; good philtrum definition.',
    metric: 'Lip ratio · 1 : 1.4',
    box: { x: 34, y: 62, w: 32, h: 12 },
    treatments: [
      { id: 'lip-care', name: 'Overnight lip mask', kind: 'Product', delta: 2 },
      { id: 'lip-filler', name: 'Structural lip filler', kind: 'Procedure', delta: 6 },
    ],
  },
  {
    id: 'jaw',
    label: 'Jawline & Chin',
    score: 68,
    ceiling: 87,
    insight: 'Soft gonial angle with mild submental fullness reducing definition.',
    metric: 'Gonial angle · 128° (ideal ~120°)',
    box: { x: 20, y: 66, w: 60, h: 26 },
    treatments: [
      { id: 'jaw-mew', name: 'Posture & tongue routine', kind: 'Routine', delta: 3, filter: { contrast: 0.03 } },
      { id: 'jaw-slim', name: 'Masseter slimming', kind: 'Procedure', delta: 5, filter: { contrast: 0.04 } },
      { id: 'jaw-filler', name: 'Jaw & chin filler', kind: 'Procedure', delta: 8, filter: { contrast: 0.05, brightness: 0.02 } },
    ],
  },
]

const SCAN_STEPS = [
  'Aligning face & detecting 68 landmarks',
  'Measuring thirds, fifths & profile angles',
  'Mapping symmetry deviation',
  'Segmenting facial regions',
  'Scoring against clinical norms',
  'Compiling treatment library',
]

const PRESETS: { id: string; name: string; desc: string; treatmentIds: string[] }[] = [
  { id: 'current', name: 'Current', desc: 'No changes applied', treatmentIds: [] },
  {
    id: 'routine',
    name: 'At-home routine',
    desc: 'Skincare & habits only',
    treatmentIds: ['skin-retinoid', 'skin-vitc', 'jaw-mew', 'brow-lam', 'lip-care', 'eye-cream'],
  },
  {
    id: 'noninvasive',
    name: 'Non-invasive',
    desc: 'Routine + light procedures',
    treatmentIds: ['skin-retinoid', 'skin-vitc', 'skin-resurf', 'brow-tox', 'jaw-slim', 'lip-filler', 'tear-trough'],
  },
  {
    id: 'max',
    name: 'Full potential',
    desc: 'Complete recommended plan',
    treatmentIds: [
      'skin-retinoid', 'skin-resurf', 'skin-vitc', 'jaw-filler', 'jaw-slim', 'nose-nsr',
      'tear-trough', 'brow-tox', 'lip-filler', 'eye-cream',
    ],
  },
]

const ALL_TREATMENTS = new Map<string, { t: Treatment; region: Region }>()
REGIONS.forEach((r) => r.treatments.forEach((t) => ALL_TREATMENTS.set(t.id, { t, region: r })))

const BASE_FILTER: FilterParts = { brightness: 1, contrast: 1, saturate: 1, sepia: 0 }

function useCountUp(target: number, run: boolean, duration = 900) {
  const [value, setValue] = useState(target)
  const prev = useRef(target)
  useEffect(() => {
    if (!run) return
    const from = prev.current
    prev.current = target
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, duration])
  return value
}

// Deterministic pseudo-landmarks for the overlay
const LANDMARKS = Array.from({ length: 68 }, (_, i) => {
  const a = (i * 137.508 * Math.PI) / 180
  const rad = 4 + (i % 9) * 4.2
  return {
    x: 50 + Math.cos(a) * rad * 0.85,
    y: 46 + Math.sin(a) * rad * 1.15,
  }
})

export function FacialAnalyzer({ studioOnly = false }: { studioOnly?: boolean }) {
  const [stage, setStage] = useState<Stage>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [scanStep, setScanStep] = useState(0)
  const [selected, setSelected] = useState<string>('jaw')
  const [active, setActive] = useState<Set<string>>(new Set())
  const [projection, setProjection] = useState(true)
  const [tools, setTools] = useState({ landmarks: true, guides: true })
  const [presetId, setPresetId] = useState('current')
  const inputRef = useRef<HTMLInputElement>(null)
  const hasBootedStudio = useRef(false)

  const runScan = useCallback(() => {
    setStage('scanning')
    setScanStep(0)
    let step = 0
    const id = setInterval(() => {
      step += 1
      if (step >= SCAN_STEPS.length) {
        clearInterval(id)
        setStage('workspace')
      } else {
        setScanStep(step)
      }
    }, 560)
  }, [])

  const handleFile = useCallback(
    (file?: File) => {
      if (!file) return
      if (!studioOnly) {
        const reader = new FileReader()
        reader.onload = () => {
          window.sessionStorage.setItem('nevengi-source-photo', String(reader.result))
          window.location.assign('/studio')
        }
        reader.readAsDataURL(file)
        return
      }
      setPreview(URL.createObjectURL(file))
      runScan()
    },
    [runScan, studioOnly],
  )

  useEffect(() => {
    if (!studioOnly || hasBootedStudio.current) return
    hasBootedStudio.current = true
    const savedPhoto = window.sessionStorage.getItem('nevengi-source-photo')
    if (savedPhoto) {
      setPreview(savedPhoto)
      runScan()
      return
    }
    if (new URLSearchParams(window.location.search).get('sample') === '1') runScan()
  }, [runScan, studioOnly])

  const openSampleStudio = () => {
    window.sessionStorage.removeItem('nevengi-source-photo')
    window.location.assign('/studio?sample=1')
  }

  const toggleTreatment = (id: string) => {
    setPresetId('custom')
    setActive((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const applyPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id)
    if (!preset) return
    setPresetId(id)
    setActive(new Set(preset.treatmentIds))
    setProjection(true)
  }

  const regionScore = (r: Region) => {
    const gained = r.treatments
      .filter((t) => active.has(t.id))
      .reduce((s, t) => s + t.delta, 0)
    return Math.min(r.ceiling, r.score + (projection ? gained : 0))
  }

  const baseOverall = useMemo(
    () => Math.round(REGIONS.reduce((s, r) => s + r.score, 0) / REGIONS.length),
    [],
  )
  const projectedOverall = useMemo(() => {
    const total = REGIONS.reduce((s, r) => {
      const gained = r.treatments.filter((t) => active.has(t.id)).reduce((a, t) => a + t.delta, 0)
      return s + Math.min(r.ceiling, r.score + gained)
    }, 0)
    return Math.round(total / REGIONS.length)
  }, [active])

  const shownOverall = projection ? projectedOverall : baseOverall
  const animatedOverall = useCountUp(shownOverall, stage === 'workspace')

  const filter = useMemo(() => {
    const f = { ...BASE_FILTER }
    active.forEach((id) => {
      const parts = ALL_TREATMENTS.get(id)?.t.filter
      if (!parts) return
      f.brightness += parts.brightness ?? 0
      f.contrast += parts.contrast ?? 0
      f.saturate += parts.saturate ?? 0
      f.sepia += parts.sepia ?? 0
    })
    return f
  }, [active])

  const filterString = projection
    ? `brightness(${filter.brightness}) contrast(${filter.contrast}) saturate(${filter.saturate}) sepia(${filter.sepia})`
    : 'none'

  const region = REGIONS.find((r) => r.id === selected)!
  const activeCount = active.size
  const img = preview || '/portrait-3.png'

  const presetScore = (ids: string[]) => {
    const total = REGIONS.reduce((s, r) => {
      const gained = r.treatments.filter((t) => ids.includes(t.id)).reduce((a, t) => a + t.delta, 0)
      return s + Math.min(r.ceiling, r.score + gained)
    }, 0)
    return Math.round(total / REGIONS.length)
  }
  const presetFilter = (ids: string[]) => {
    const f = { ...BASE_FILTER }
    ids.forEach((id) => {
      const parts = ALL_TREATMENTS.get(id)?.t.filter
      if (!parts) return
      f.brightness += parts.brightness ?? 0
      f.contrast += parts.contrast ?? 0
      f.saturate += parts.saturate ?? 0
    })
    return `brightness(${f.brightness}) contrast(${f.contrast}) saturate(${f.saturate})`
  }

  return (
    <section id={studioOnly ? undefined : 'analyze'} className={`${studioOnly ? 'min-h-[calc(100vh-73px)] py-8 sm:py-10' : 'scroll-mt-24 px-4 py-24 sm:py-28'}`}>
      <div className="mx-auto max-w-6xl">
        {!studioOnly && <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft/40 px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-brand-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            THE ANALYSIS WORKSPACE
          </span>
          <h2 className="mt-6 text-balance text-4xl font-medium tracking-tight sm:text-5xl">
            Your face, engineered
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Not a number and a shrug. Upload a photo and step into a full assessment
            studio — segmented regions, clinical measurements, a treatment library, and
            a live projection of your potential.
          </p>
        </div>}

        {stage === 'idle' && !studioOnly && (
          <div className="mx-auto mt-12 grid max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_70px_-34px_rgba(20,60,70,0.28)] md:grid-cols-2">
            <div className="relative min-h-[360px] overflow-hidden bg-[#143238] md:min-h-full">
              <img src="/portrait-female.png" alt="Portrait used for Nevengi analysis" className="absolute inset-0 h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e282d]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/15 bg-[#0d252a]/75 p-4 text-white backdrop-blur">
                <p className="font-mono text-[10px] tracking-[0.17em] text-[#a7f3d0]">NEVENGI STUDIO</p>
                <p className="mt-1 text-sm leading-relaxed text-white/75">A structured workspace for landmarks, visual studies and your practical next steps.</p>
              </div>
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              className="group relative flex min-h-[360px] w-full flex-col items-center justify-center gap-4 px-8 py-14 text-center transition-colors hover:bg-brand-soft/20 sm:px-12"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand-strong">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-lg font-medium">Upload a front-facing photo</span>
              <span className="max-w-sm text-sm text-muted-foreground">
                Neutral expression, even lighting, hair off the face. Processed privately —
                never stored or shared.
              </span>
              <span className="mt-2 rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-primary-foreground">
                Open the studio
              </span>
            </button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              No photo handy?{' '}
              <button onClick={openSampleStudio} className="font-medium text-brand-strong underline underline-offset-2">
                Try it with a sample face
              </button>
            </p>
          </div>
        )}

        {stage === 'idle' && studioOnly && (
          <div className="mx-auto mt-16 max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-[0_24px_70px_-34px_rgba(20,60,70,0.28)]">
            <p className="font-mono text-[10px] tracking-[0.18em] text-brand">NO SOURCE PHOTO</p>
            <h1 className="mt-3 text-3xl font-medium tracking-tight">Start an assessment from the home page.</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Choose a front-facing photo first, and Nevengi will open it here in the Studio.</p>
            <a href="/#analyze" className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-medium text-primary-foreground">Back to upload</a>
          </div>
        )}

        {!studioOnly && <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />}

        {stage === 'scanning' && (
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand/60" />
              <span className="ml-2 font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
                NEVENGI STUDIO — ANALYZING
              </span>
            </div>
            <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
              <div className="relative border-b border-border md:border-b-0 md:border-r">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img || '/placeholder.svg'} alt="Portrait being analyzed" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-brand-strong/15" />
                  <div className="scan-line absolute inset-x-0 h-0.5 bg-brand shadow-[0_0_18px_3px_var(--brand)]" />
                  {LANDMARKS.slice(0, Math.round((scanStep + 1) * 11)).map((p, i) => (
                    <span
                      key={i}
                      className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
                {SCAN_STEPS.map((label, i) => {
                  const activeStep = i === scanStep
                  const done = i < scanStep
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full font-mono text-[10px] transition-colors ${
                          done ? 'bg-brand text-primary-foreground' : activeStep ? 'bg-brand/20 text-brand-strong' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {done ? '✓' : i + 1}
                      </span>
                      <span className={`text-sm transition-colors ${activeStep || done ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {label}
                        {activeStep && <span className="ml-1 animate-pulse">…</span>}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {stage === 'workspace' && (
          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_70px_-34px_rgba(20,60,70,0.4)]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border bg-secondary/40 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-brand/60" />
              </div>
              <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
                NEVENGI STUDIO
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                {[
                  { key: 'landmarks' as const, label: 'Landmarks' },
                  { key: 'guides' as const, label: 'Guides' },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTools((s) => ({ ...s, [t.key]: !s[t.key] }))}
                    className={`rounded-md px-2.5 py-1 font-mono text-[10px] tracking-wide transition-colors ${
                      tools[t.key] ? 'bg-brand/15 text-brand-strong' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
                <button
                  onClick={() => setProjection((p) => !p)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[10px] tracking-wide transition-colors ${
                    projection ? 'bg-brand text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {projection ? 'PROJECTION ON' : 'PROJECTION OFF'}
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[13rem_1fr_18rem]">
              {/* Left: region layers */}
              <div className="border-b border-border p-3 lg:border-b-0 lg:border-r">
                <p className="px-2 pb-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                  REGIONS
                </p>
                <div className="flex flex-col gap-1">
                  {REGIONS.map((r) => {
                    const sc = regionScore(r)
                    const gained = sc - r.score
                    const isSel = r.id === selected
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelected(r.id)}
                        className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors ${
                          isSel ? 'bg-brand/12 ring-1 ring-brand/30' : 'hover:bg-muted'
                        }`}
                      >
                        <span className={`text-[13px] ${isSel ? 'font-medium text-foreground' : 'text-foreground/80'}`}>
                          {r.label}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <span className={isSel ? 'text-brand-strong' : 'text-muted-foreground'}>{sc}</span>
                          {gained > 0 && <span className="text-gold">+{gained}</span>}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-3 rounded-lg bg-secondary/50 p-3">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                    OVERALL HARMONY
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-medium text-brand-strong">{animatedOverall}</span>
                    <span className="font-mono text-xs text-muted-foreground">/100</span>
                    {projection && projectedOverall > baseOverall && (
                      <span className="ml-auto font-mono text-xs text-gold">+{projectedOverall - baseOverall}</span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Base {baseOverall} → potential {presetScore(PRESETS[3].treatmentIds)}
                  </p>
                </div>
              </div>

              {/* Center: canvas */}
              <div className="relative border-b border-border bg-gradient-to-br from-brand-soft/25 to-secondary/40 p-4 sm:p-6 lg:border-b-0">
                <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img || '/placeholder.svg'}
                    alt="Your analyzed portrait with projection applied"
                    className="h-full w-full object-cover transition-[filter] duration-700"
                    style={{ filter: filterString }}
                  />

                  {/* Guides */}
                  {tools.guides && (
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 125" preserveAspectRatio="none" aria-hidden>
                      <line x1="50" y1="0" x2="50" y2="125" stroke="var(--brand)" strokeWidth="0.3" strokeDasharray="1.5 1.5" opacity="0.5" />
                      {[41.6, 62.5, 83.3].map((y) => (
                        <line key={y} x1="8" y1={y} x2="92" y2={y} stroke="var(--brand)" strokeWidth="0.3" strokeDasharray="1.5 1.5" opacity="0.35" />
                      ))}
                    </svg>
                  )}

                  {/* Landmarks */}
                  {tools.landmarks &&
                    LANDMARKS.map((p, i) => (
                      <span
                        key={i}
                        className="absolute h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/70"
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      />
                    ))}

                  {/* Selected region highlight */}
                  <div
                    className="pointer-events-none absolute rounded-lg border-2 border-brand transition-all duration-300"
                    style={{
                      left: `${region.box.x}%`,
                      top: `${region.box.y}%`,
                      width: `${region.box.w}%`,
                      height: `${region.box.h}%`,
                      boxShadow: '0 0 0 9999px rgba(20,50,58,0.28)',
                    }}
                  >
                    <span className="absolute -top-5 left-0 rounded bg-brand px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-primary-foreground">
                      {region.label.toUpperCase()}
                    </span>
                  </div>

                  {projection && (
                    <span className="absolute right-2 top-2 rounded-full bg-brand-strong/85 px-2.5 py-1 font-mono text-[9px] tracking-widest text-primary-foreground backdrop-blur">
                      PROJECTION
                    </span>
                  )}
                </div>

                {/* Variant filmstrip */}
                <div className="mt-5">
                  <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                    PROJECTED VERSIONS
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESETS.map((p) => {
                      const isSel = presetId === p.id
                      return (
                        <button
                          key={p.id}
                          onClick={() => applyPreset(p.id)}
                          className={`overflow-hidden rounded-lg border text-left transition-colors ${
                            isSel ? 'border-brand ring-1 ring-brand/40' : 'border-border hover:border-brand/40'
                          }`}
                        >
                          <div className="relative aspect-square overflow-hidden bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img || '/placeholder.svg'}
                              alt={`${p.name} projection`}
                              className="h-full w-full object-cover"
                              style={{ filter: p.id === 'current' ? 'none' : presetFilter(p.treatmentIds) }}
                            />
                            <span className="absolute bottom-1 right-1 rounded bg-background/85 px-1 font-mono text-[9px] font-medium text-brand-strong">
                              {presetScore(p.treatmentIds)}
                            </span>
                          </div>
                          <div className="px-1.5 py-1">
                            <p className={`text-[11px] leading-tight ${isSel ? 'font-medium text-foreground' : 'text-foreground/80'}`}>
                              {p.name}
                            </p>
                            <p className="text-[9px] leading-tight text-muted-foreground">{p.desc}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right: inspector */}
              <div className="flex flex-col p-4 sm:p-5">
                <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                  INSPECTOR
                </p>
                <h3 className="mt-1 text-lg font-medium">{region.label}</h3>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-500"
                      style={{ width: `${regionScore(region)}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm text-brand-strong">{regionScore(region)}</span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{region.metric}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">{region.insight}</p>

                <p className="mt-5 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                  TREATMENT LIBRARY
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  {region.treatments.map((t) => {
                    const on = active.has(t.id)
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTreatment(t.id)}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          on ? 'border-brand/50 bg-brand/8' : 'border-border hover:bg-muted'
                        }`}
                      >
                        <span
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded border transition-colors ${
                            on ? 'border-brand bg-brand text-primary-foreground' : 'border-border'
                          }`}
                        >
                          {on && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <path d="M2.5 6.2l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-medium leading-tight text-foreground">{t.name}</span>
                          <span className="font-mono text-[10px] text-muted-foreground">{t.kind}</span>
                        </span>
                        <span className="font-mono text-[11px] text-gold">+{t.delta}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-5 rounded-xl bg-secondary/50 p-3 text-center">
                  <p className="text-[13px] text-foreground/80">
                    <span className="font-medium text-foreground">{activeCount}</span> treatments in your plan
                  </p>
                </div>
                <a
                  href="#plan"
                  className="mt-3 w-full rounded-full bg-brand px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]"
                >
                  Get my full plan &amp; roadmap
                </a>
              </div>
            </div>
          </div>
        )}

        <p className="mx-auto mt-4 max-w-xl text-center text-xs text-muted-foreground">
          Projections are an aesthetic simulation based on facial-proportion research, not a
          medical diagnosis or guaranteed outcome.
        </p>
      </div>
    </section>
  )
}
