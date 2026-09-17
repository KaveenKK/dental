const steps = [
  {
    step: '01',
    title: 'Submit your photos',
    body: 'Upload a few standard front and side photos. Our capture guide ensures clinical-quality framing in under two minutes.',
  },
  {
    step: '02',
    title: 'Receive your analysis',
    body: 'We map your facial proportions, symmetry and harmony, then benchmark them against established aesthetic frameworks.',
  },
  {
    step: '03',
    title: 'Follow your plan',
    body: 'Get a prioritized roadmap — from skin and grooming to structural options — with your projected result to work toward.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">
              How it works
            </span>
            <h2 className="mt-4 text-balance text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
              Three steps from photo to plan.
            </h2>
          </div>
          <a
            href="#plan"
            className="self-start rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary sm:self-auto"
          >
            Start my plan
          </a>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.step}
              className="rounded-3xl border border-border bg-card p-8 sm:p-9"
            >
              <div className="font-mono text-sm text-brand">{s.step}</div>
              <h3 className="mt-8 text-xl font-medium tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
