import { Plus } from 'lucide-react'

const faqs = [
  {
    q: 'Is Refyn a medical or clinical service?',
    a: 'Refyn provides a clinical-grade aesthetic assessment for educational and personal-improvement purposes. It is not a medical diagnosis. For any procedure, we help you prepare and refer you to qualified, licensed practitioners.',
  },
  {
    q: 'What photos do I need to submit?',
    a: 'A neutral front-facing photo and both side profiles in even lighting. Our in-app capture guide walks you through framing, distance and lighting so your analysis is accurate.',
  },
  {
    q: 'How accurate is the analysis?',
    a: 'We measure over 40 facial landmarks and benchmark them against established proportional frameworks used in aesthetic practice. The result is objective measurement rather than subjective opinion.',
  },
  {
    q: 'What does the projection show?',
    a: 'The projection is an evidence-based visualization of the realistic outcome your personalized plan is built toward — not an unrealistic filter. It gives you a concrete target to work against.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your photos and results are encrypted, never sold, and can be permanently deleted at any time from your account.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'If your assessment hasn&apos;t been generated yet, you can request a full refund. Once your personalized report is delivered, it becomes non-refundable.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="px-4 pt-28 sm:pt-36">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">
            FAQ
          </span>
          <h2 className="mt-4 text-balance text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            Answers before you start.
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
            Still unsure? Reach us at{' '}
            <a href="#" className="text-foreground underline underline-offset-4">
              hello@refyn.co
            </a>
            .
          </p>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {faqs.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="text-[16px] font-medium tracking-tight">
                  {item.q}
                </span>
                <Plus className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
