import { legalPages } from "@/lib/pages-data";
import { PageHeader } from "./page-header";
import { Appear } from "./appear";
import { Prose } from "./prose";

export function LegalPage({ slug }: { slug: string }) {
  const page = legalPages[slug];
  return (
    <main>
      <PageHeader eyebrow="[ LEGAL ]" title={page.title.toLowerCase()} compact />
      <section className="section">
        <div className="container">
          <Appear className="mx-auto w-full max-w-[760px]">
            <Prose blocks={page.blocks} />
          </Appear>
        </div>
      </section>
    </main>
  );
}
