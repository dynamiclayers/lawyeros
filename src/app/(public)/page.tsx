import { PublicHeader } from "@/components/public/public-header";
import { HeroSection } from "@/components/public/hero-section";
import { PracticeAreaGrid } from "@/components/public/practice-area-grid";
import { AboutSection } from "@/components/public/about-section";
import { BookingWizard } from "@/components/public/booking-wizard";
import { Testimonials } from "@/components/public/testimonials";
import { FaqAccordion } from "@/components/public/faq-accordion";
import { PublicFooter } from "@/components/public/public-footer";

export default function PublicHomePage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="mx-auto max-w-[1440px]">
        <HeroSection />
        <PracticeAreaGrid />
        <AboutSection />
        <BookingWizard />
        <Testimonials />
        <FaqAccordion />
      </main>
      <PublicFooter />
    </>
  );
}
