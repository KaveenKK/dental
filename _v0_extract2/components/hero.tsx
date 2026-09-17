import { ComparisonSlider } from './comparison-slider'

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
            Nevengi scores your facial harmony against clinical proportion research,
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

        {/* Right visuals */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          <ComparisonSlider
            image="/portrait-female.png"
            alt="Facial assessment comparison of a woman before and projected result"
          />
          <div className="translate-y-6">
            <ComparisonSlider
              image="/portrait-male.png"
              alt="Facial assessment comparison of a man before and projected result"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
