import type { Metadata } from "next";
import { site, stackLogos, TRUST_CLAIM } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Studio } from "@/components/studio";
import { PageIntro, ContactBand, BackHome } from "@/components/page-shell";
import { ProcessSection } from "@/components/process-section";
import { LogoCloud } from "@/components/logo-cloud";
import { Results } from "@/components/results";

export const metadata: Metadata = {
  title: `Studio — ${site.name}`,
  description:
    "Black Line Agency is a two-person, founder-led studio. The people you meet are the people who design, build and run your site.",
  alternates: { canonical: "/studio" },
};

export default function StudioPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <PageIntro
          eyebrow="The studio"
          image="/images/pages/studio.webp"
          headingId="studio-page-heading"
          heading="Two people. No account layer."
          lede="You will not be handed to a junior after signing. The founders design it, build it and answer the phone — which is why we take on a small number of projects at a time and say so plainly."
        />
        <Studio />
        <ProcessSection />
        {/* The tools we build with, then the standard we hold ourselves to —
            the two things a prospect vets a two-person studio on
            (redesign, 2026-09-11). */}
        <LogoCloud
          items={stackLogos}
          label="The stack we build on"
          heading={TRUST_CLAIM}
        />
        <Results />
        <ContactBand heading="Want to meet the studio?" />
        <BackHome />
      </main>
      <Footer />
    </>
  );
}
