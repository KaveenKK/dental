import { Layers, ScanFace, SlidersHorizontal, Sparkles } from 'lucide-react'

const stats = [
  { value: '68', label: 'Facial landmarks mapped' },
  { value: '120k+', label: 'Analyses completed' },
  { value: '4.8/5', label: 'Member rating' },
]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-28 sm:pt-32 lg:pt-36">
      {/* ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 80% 0%, color-mix(in oklch, var(--brand-soft) 55%, transparent), transparent 70%)',
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Left copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-card px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-brand-strong">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            CLINICAL-GRADE FACIAL ANALYSIS
          </span>

          <h1 className="mt-6 text-balance text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl">
            Know your face.
            <span className="block text-brand">Then perfect it.</span>
          </h1>

          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
            Nevengi helps structure your facial assessment around clinical proportion research,
            pinpoints your highest-impact opportunities, and builds a personalized,
            non-surgical plan — backed by science, not guesswork.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#analyze"
              className="rounded-full bg-brand px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_var(--brand)] transition-transform hover:scale-[1.02]"
            >
              Get my free analysis
            </a>
            <a
              href="#how"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              See how it works
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-7">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-mono text-2xl font-medium tracking-tight text-brand-strong">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#17363a] bg-[#0d2025] p-3 shadow-[0_28px_60px_-32px_rgba(14,72,76,0.8)] sm:p-4">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#10282d] px-3 py-2.5 text-white">
            <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-primary-foreground"><ScanFace className="h-3.5 w-3.5" /></span><span className="text-xs font-medium">Nevengi Studio</span></div>
            <span className="font-mono text-[9px] tracking-[0.15em] text-[#a7f3d0]">WORKSPACE PREVIEW</span>
          </div>
          <div className="mt-3 grid grid-cols-[82px_minmax(0,1fr)] gap-3 sm:grid-cols-[104px_minmax(0,1fr)]">
            <div className="rounded-xl border border-white/10 bg-[#0a1a1f] p-2 text-white/55">
              <p className="hidden font-mono text-[8px] tracking-[0.15em] text-white/35 sm:block">LAYERS</p>
              <div className="mt-1 space-y-2 sm:mt-3">
                {[[Layers, 'Overview'], [Sparkles, 'Skin'], [ScanFace, 'Structure'], [SlidersHorizontal, 'Studies']].map(([Icon, label], index) => {
                  const ToolIcon = Icon as typeof Layers
                  return <div key={String(label)} className={`flex items-center gap-1.5 rounded-md px-1.5 py-1.5 text-[9px] sm:text-[10px] ${index === 0 ? 'bg-brand text-primary-foreground' : ''}`}><ToolIcon className="h-3 w-3 shrink-0" /><span className="truncate">{String(label)}</span></div>
                })}
              </div>
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-white/10 bg-[#10282d] sm:min-h-[360px]">
              <img src="/portrait-female.png" alt="Nevengi facial-analysis workspace preview" className="absolute inset-0 h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />
              <div className="absolute left-[34%] top-[19%] h-[55%] w-[34%] rounded-[45%] border border-[#a7f3d0]/80" />
              <div className="absolute inset-x-[18%] top-1/2 border-t border-dashed border-[#a7f3d0]/70" />
              <div className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-[#092126]/80 px-2 py-1.5 font-mono text-[8px] tracking-[0.14em] text-white/80 backdrop-blur">LANDMARK MAP / READY</div>
            </div>
          </div>
          <p className="px-1 pt-3 text-xs leading-relaxed text-white/55">A structured space for source photos, measurement layers, visual studies and a practical plan.</p>
        </div>
      </div>
    </section>
  )
}
