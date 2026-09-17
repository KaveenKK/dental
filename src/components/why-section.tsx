import { Ruler, ScanFace, ClipboardList, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: ScanFace,
    title: 'Clinical-grade analysis',
    body: 'Every submission is assessed across 40+ facial landmarks using the same proportional frameworks trusted by aesthetic clinicians.',
  },
  {
    icon: Ruler,
    title: 'Measured, not guessed',
    body: 'We quantify symmetry, ratios and harmony so your recommendations are grounded in objective measurement — never opinion.',
  },
  {
    icon: ClipboardList,
    title: 'A plan for your face',
    body: 'You receive a prioritized, step-by-step roadmap covering skin, grooming, structure and lifestyle — tailored to your features.',
  },
  {
    icon: ShieldCheck,
    title: 'Private and secure',
    body: 'Your photos and results are encrypted, never sold, and deletable at any time. Your assessment stays yours.',
  },
]

export function WhySection() {
  return (
    <section id="why" className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">
            Why Nevengi
          </span>
          <h2 className="mt-4 text-balance text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            The rigor of a clinic, in an assessment you can start today.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            Most beauty advice is generic. Nevengi treats your face as the specific
            structure it is — analyzing it with precision, then translating the
            data into changes that actually matter.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="bg-background p-8 sm:p-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary text-foreground">
                <f.icon className="h-5 w-5" strokeWidth={1.6} />
              </div>
              <h3 className="mt-6 text-lg font-medium tracking-tight">
                {f.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
