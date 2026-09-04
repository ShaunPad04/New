import type { Metadata } from "next";
import { site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Services } from "@/components/services";
import { PageIntro, ContactBand, BackHome } from "@/components/page-shell";

export const metadata: Metadata = {
  title: `Services — ${site.name}`,
  description:
    "Web design and build, Google SEO management, email and SMS marketing, managed hosting and ongoing optimisation — run by the two people who do the work.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <PageIntro
          eyebrow="Services"
          headingId="services-page-heading"
          heading="Built, then kept earning."
          lede="Most studios hand over a site and disappear. We build the thing and then run the search, email and SMS that keep it bringing work in — because a website that nobody maintains stops paying for itself within a year."
        />
        <Services />
        <ContactBand heading="Which of these do you actually need?" />
        <BackHome />
      </main>
      <Footer />
    </>
  );
}
