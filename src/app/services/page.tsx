import type { Metadata } from "next";
import { site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Services } from "@/components/services";
import { PageIntro, ContactBand, BackHome } from "@/components/page-shell";
import { ProcessScroll } from "@/components/process-scroll";
import { Results } from "@/components/results";
import { processSteps } from "@/lib/content";
import { resolveProcessImage } from "@/lib/work-image";

export const metadata: Metadata = {
  title: `Services — ${site.name}`,
  description:
    "Web design and build, UI and UX design, Google SEO management, email and SMS marketing, managed hosting and ongoing optimisation — run by the two people who do the work.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <PageIntro
          eyebrow="Services"
          image="/images/pages/services.webp"
          headingId="services-page-heading"
          heading="Built, then kept earning."
          lede="Most studios hand over a site and disappear. We build the thing and then run the search, email and SMS that keep it bringing work in — because a website that nobody maintains stops paying for itself within a year."
        />
        <Services />
        {/* What commissioning any of it actually looks like (redesign,
            2026-09-11): the pinned horizontal process ride, then the
            standard every build is held to — the page answers "what do you
            do" and "how" in one visit. Image paths resolved here (server)
            so a missing file degrades to a designed plate. */}
        <ProcessScroll
          images={Object.fromEntries(
            processSteps.map((s) => [s.id, resolveProcessImage(s.id)]),
          )}
        />
        <Results />
        <ContactBand heading="Which of these do you actually need?" />
        <BackHome />
      </main>
      <Footer />
    </>
  );
}
