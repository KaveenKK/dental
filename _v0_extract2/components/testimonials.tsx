import { Star } from 'lucide-react'

const quotes = [
  {
    quote:
      'The analysis was startlingly precise. For the first time I understood what to actually change instead of guessing. Three months in, people notice.',
    name: 'Daniel R.',
    detail: 'Member since 2024',
  },
  {
    quote:
      'It felt like a consultation with a specialist, not an app. The plan was specific, realistic, and prioritized so I knew exactly where to start.',
    name: 'Sofia M.',
    detail: 'Member since 2025',
  },
  {
    quote:
      'The projection kept me consistent. Having a clear target to work toward changed how I approached everything from skincare to sleep.',
    name: 'Marcus T.',
    detail: 'Member since 2024',
  },
]

export function Testimonials() {
  return (
    <section className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">
            Member stories
          </span>
          <h2 className="mt-4 text-balance text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            Confidence, measured and earned.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <figure
              key={q.name}
              className="flex flex-col rounded-3xl border border-border bg-card p-8"
            >
              <div className="flex gap-0.5 text-foreground">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-foreground/90">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="text-sm font-medium">{q.name}</div>
                <div className="text-xs text-muted-foreground">{q.detail}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
