import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Assessment',
    price: '$49',
    cadence: 'one-time',
    description: 'A complete clinical-grade facial analysis and report.',
    features: [
      '40+ landmark facial analysis',
      'Symmetry & proportion scores',
      'Written report with findings',
      'Projected result visualization',
    ],
    cta: 'Get my assessment',
    featured: false,
  },
  {
    name: 'Full Plan',
    price: '$129',
    cadence: 'one-time',
    description: 'Everything in Assessment plus your prioritized roadmap.',
    features: [
      'Everything in Assessment',
      'Step-by-step improvement plan',
      'Skin, grooming & structure guidance',
      'Product & routine recommendations',
      '3 follow-up reassessments',
    ],
    cta: 'Start my plan',
    featured: true,
  },
  {
    name: 'Concierge',
    price: '$349',
    cadence: 'one-time',
    description: 'Guided support from our specialists, end to end.',
    features: [
      'Everything in Full Plan',
      '1:1 specialist consultation',
      'Clinic referral & question prep',
      'Priority reassessments for 12 months',
    ],
    cta: 'Talk to us',
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="plan" className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">
            Plans
          </span>
          <h2 className="mt-4 text-balance text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            Choose how far you want to take it.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            No subscriptions. Pay once, keep your results, and upgrade whenever
            you&apos;re ready.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-3xl border p-8 ${
                p.featured
                  ? 'border-foreground bg-foreground text-background shadow-[0_20px_50px_rgba(0,0,0,0.18)] lg:-translate-y-3'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium tracking-tight">{p.name}</h3>
                {p.featured && (
                  <span className="rounded-full bg-background/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]">
                    Popular
                  </span>
                )}
              </div>
              <div className="mt-6 flex items-end gap-1.5">
                <span className="text-4xl font-medium tracking-tight">
                  {p.price}
                </span>
                <span
                  className={`pb-1 text-sm ${p.featured ? 'text-background/70' : 'text-muted-foreground'}`}
                >
                  {p.cadence}
                </span>
              </div>
              <p
                className={`mt-3 text-[15px] leading-relaxed ${p.featured ? 'text-background/75' : 'text-muted-foreground'}`}
              >
                {p.description}
              </p>

              <ul className="mt-7 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px]">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? 'text-background' : 'text-brand'}`}
                      strokeWidth={2}
                    />
                    <span className={p.featured ? 'text-background/90' : ''}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#top"
                className={`mt-8 rounded-full px-6 py-3.5 text-center text-sm font-medium transition-transform hover:scale-[1.02] ${
                  p.featured
                    ? 'bg-background text-foreground'
                    : 'bg-foreground text-background'
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
