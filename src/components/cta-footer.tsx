import { Logo } from './logo'

export function CtaFooter() {
  return (
    <footer className="px-4 pb-8 pt-28 sm:pt-36">
      <div className="mx-auto max-w-6xl">
        {/* CTA */}
        <div className="relative overflow-hidden rounded-[2rem] bg-foreground px-6 py-16 text-center text-background sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 0%, white, transparent 60%)',
            }}
          />
          <h2 className="relative mx-auto max-w-2xl text-balance text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            Your best face is a plan away.
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-pretty text-background/70">
            Start your clinical-grade assessment today and see exactly where you
            stand — and where you could go.
          </p>
          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#plan"
              className="rounded-full bg-background px-7 py-3.5 text-sm font-medium text-foreground transition-transform hover:scale-[1.02]"
            >
              Start my plan
            </a>
            <a
              href="#how"
              className="rounded-full border border-background/25 px-7 py-3.5 text-sm font-medium text-background transition-colors hover:bg-background/10"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col justify-between gap-8 border-t border-border pt-10 md:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Clinical-grade facial aesthetics assessment. Measured insight, a
              personalized plan, and a clear projection to work toward.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Product"
              links={['Why Refyn', 'How it works', 'Results', 'Plans']}
            />
            <FooterCol
              title="Company"
              links={['About', 'Science', 'Careers', 'Contact']}
            />
            <FooterCol
              title="Legal"
              links={['Privacy', 'Terms', 'Data & security']}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Refyn. All rights reserved.</p>
          <p>Not a substitute for professional medical advice.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
