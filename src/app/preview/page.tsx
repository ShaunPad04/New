import type { Metadata } from "next";
import { Header, HeaderSurfaceSentinel } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProcessSection } from "@/components/process-section";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import { ChromeMonogram } from "@/components/v2/chrome-monogram";
import { StartBand } from "@/components/v2/start-band";
import { LuraisFilmHero } from "@/components/v3/lurais-film-hero";
import { LuraisIntro } from "@/components/v3/lurais-intro";
import { LuraisWork } from "@/components/v3/lurais-work";
import { LuraisPrinciples } from "@/components/v3/lurais-principles";
import { LuraisServices } from "@/components/v3/lurais-services";
import { LuraisStandards } from "@/components/v3/lurais-standards";
import { SectionRule } from "@/components/v3/lurais-parts";

/**
 * /preview — the full homepage in the Lurais direction, for Brad to approve
 * before it replaces `/` (2026-09-25). Chosen: DARK, the scroll film kept
 * behind the hero, the chrome BL mid-page.
 *
 * Preview only: noindex/nofollow, absent from the sitemap, linked from
 * nowhere. The live homepage is untouched until he signs this off.
 *
 * Pricing, FAQ, the process ride and the enquiry form are the site's own
 * components, unchanged — their legal wording and gates travel with them.
 * Testimonials and invented "facts & figures" from the template are left
 * out: none exist that are true.
 */
export const metadata: Metadata = {
  title: "Homepage preview",
  robots: { index: false, follow: false },
};

function Rule({ index, label }: { index: string; label: string }) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
      <SectionRule index={index} label={label} />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <LuraisFilmHero />
        <HeaderSurfaceSentinel />
        <LuraisIntro headingId="intro-heading" />
        <LuraisWork />
        <Rule index="03" label="The mark" />
        <ChromeMonogram />
        <LuraisPrinciples />
        <LuraisServices />
        <Rule index="06" label="Process" />
        <ProcessSection />
        <LuraisStandards />
        <Rule index="08" label="Pricing" />
        <Pricing />
        <Rule index="09" label="FAQ" />
        <Faq compact />
        <StartBand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
