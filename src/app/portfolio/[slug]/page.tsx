import type { Metadata, ResolvingMetadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { notFound } from "next/navigation";
import { caseStudies, projects } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CaseStudyView } from "@/components/v3/case-study-view";

/**
 * CASE STUDY — one project, its own URL, generated statically from
 * `caseStudies`. Since 2026-10-02 (Brad, previewed at /lab/case) it is the
 * Neiden-style page in `CaseStudyView`: the project's picture full-screen
 * (grown into from the homepage or portfolio frame), the write-up on a light
 * band, then more work.
 *
 * The honesty rule stands: the page describes what we were asked for,
 * designed and built, never a RESULT the project has not produced. B Boutique
 * launched too recently to have measured results, so the page says plainly
 * that there are none yet (`outcomeNote`).
 */

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) return {};

  return pageMetadata(parent, { title: `${study.title} — case study`, description: study.lede, path: `/portfolio/${study.slug}` });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) notFound();

  return (
    <>
      <Header />
      <main id="main" className="v3 flex-1">
        <CaseStudyView study={study} project={projects.find((p) => p.id === study.projectId)} />
      </main>
      <Footer />
    </>
  );
}
