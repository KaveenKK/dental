import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { FacialAnalyzer } from '@/components/facial-analyzer'
import { TrustBar } from '@/components/trust-bar'
import { WhySection } from '@/components/why-section'
import { HowItWorks } from '@/components/how-it-works'
import { ResultsSection } from '@/components/results-section'
import { Testimonials } from '@/components/testimonials'
import { Pricing } from '@/components/pricing'
import { Faq } from '@/components/faq'
import { CtaFooter } from '@/components/cta-footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <FacialAnalyzer />
        <WhySection />
        <HowItWorks />
        <ResultsSection />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <CtaFooter />
    </div>
  )
}
