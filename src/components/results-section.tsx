import { ComparisonSlider } from './comparison-slider'

const cases = [
  {
    image: '/portrait-3.png',
    alt: 'Facial assessment comparison for member case one',
    tag: 'Skin & harmony',
  },
  {
    image: '/portrait-4.png',
    alt: 'Facial assessment comparison for member case two',
    tag: 'Structure & grooming',
  },
  {
    image: '/portrait-female.png',
    projectionImage: '/projection-female.jpg',
    projectionScale: 0.94,
    projectionOffsetY: -1.5,
    projectionOrigin: '50% 39%',
    alt: 'Facial assessment comparison for member case three',
    tag: 'Symmetry & proportion',
  },
]

export function ResultsSection() {
  return (
    <section id="results" className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">
            Results
          </span>
          <h2 className="mt-4 text-balance text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            See the projection. Then achieve it.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            Drag each slider to compare a member&apos;s starting point with the
            evidence-based projection their plan is built toward.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <figure key={c.alt}>
              <ComparisonSlider
                image={c.image}
                projectionImage={c.projectionImage}
                projectionScale={c.projectionScale}
                projectionOffsetY={c.projectionOffsetY}
                projectionOrigin={c.projectionOrigin}
                alt={c.alt}
              />
              <figcaption className="mt-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {c.tag}
                </span>
                <span className="text-xs text-muted-foreground">
                  Projected result
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
