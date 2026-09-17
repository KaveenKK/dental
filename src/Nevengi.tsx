import { useEffect, useState } from 'react';
import { SiteHeader } from './components/site-header';
import { Logo } from './components/logo';
import { Hero } from './components/hero';
import { FacialAnalyzer } from './components/facial-analyzer';
import { TrustBar } from './components/trust-bar';
import { WhySection } from './components/why-section';
import { HowItWorks } from './components/how-it-works';
import { ResultsSection } from './components/results-section';
import { Testimonials } from './components/testimonials';
import { Pricing } from './components/pricing';
import { Faq } from './components/faq';
import { CtaFooter } from './components/cta-footer';

export default function Nevengi() {
  const [isStudio, setIsStudio] = useState(() => window.location.pathname === '/studio');

  useEffect(() => {
    const syncRoute = () => setIsStudio(window.location.pathname === '/studio');
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  if (isStudio) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card/85 px-4 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <a href="/"><Logo /></a>
            <a href="/#analyze" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Exit studio</a>
          </div>
        </header>
        <main className="px-4"><FacialAnalyzer studioOnly /></main>
      </div>
    );
  }

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
  );
}
