import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CaseStudies } from "@/components/v3/case-studies";
import { ProofBand } from "@/components/v3/proof-band";
import { Bridge } from "@/components/v3/bridge";
import { Grid } from "@/components/v3/page-grid";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    /* Says what is on the page: one live client site and concept projects,
       each labelled for what it is. B Boutique went live in September 2026,
       so "a client build in progress" was retired. */
    "Work from a founder-led studio: a live client site and concept projects, each labelled for what it is, with the decisions behind them written up rather than summarised.",
  alternates: { canonical: "/portfolio" },
};

/**
 * PORTFOLIO as the homepage's case studies (Brad, 2026-10-02: previewed at
 * /lab/portfolio, then "we should do portfolio first"), as Neiden's projects
 * page is its homepage section with the title on top. The section heading
 * becomes the h1 (project names h2), there is no "All projects" row on the
 * page that is all projects, and each picture opens its case study with the
 * picture-to-page morph. Then the measured standards, as before.
 *
 * Only real, client-approved work (`projects`); Concept badges printed.
 */
export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main id="main" className="v3 flex-1">
        <CaseStudies heading="h1" closing={false} />
        <Bridge from="#161616" to="#f0f0f0" />
        <div className="band-light relative bg-ink-0">
          <Grid rule="border-ink-1000/8" reading />
          <div className="relative px-6 sm:px-10">
            <ProofBand index="02" />
          </div>
        </div>
        <Bridge from="#f0f0f0" to="#000000" />
      </main>
      <Footer />
    </>
  );
}
