const stats = [
  { value: '2.1M+', label: 'Facial features analyzed' },
  { value: '180K', label: 'Personalized plans built' },
  { value: '94%', label: 'Report visible improvement' },
  { value: '4.9/5', label: 'Average member rating' },
]

export function TrustBar() {
  return (
    <section className="px-4 pt-24 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Trusted by members in 40+ countries
        </p>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-background px-6 py-8 text-center">
              <div className="text-3xl font-medium tracking-tight sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
