import type { Metadata } from "next";
import { site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Studio } from "@/components/studio";
import { PageIntro, ContactBand, BackHome } from "@/components/page-shell";

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
          headingId="studio-page-heading"
          heading="Two people. No account layer."
          lede="You will not be handed to a junior after signing. The founders design it, build it and answer the phone — which is why we take on a small number of projects at a time and say so plainly."
        />
        <Studio />
        <ContactBand heading="Want to meet the studio?" />
        <BackHome />
      </main>
      <Footer />
    </>
  );
}
