import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { careersPage } from "@/lib/pages";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { Features } from "@/components/features";

export const metadata: Metadata = {
  title: "Careers",
  description: `${careersPage.title} ${careersPage.copy}`,
};

export default function CareersPage() {
  return (
    <main>
      <PageHeader eyebrow={careersPage.eyebrow} title={careersPage.title} copy="Check out our current vacancies." image={upload(careersPage.image)} />
      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-3">
            <Appear>
              <p className="caption2">[ VACANCIES ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">{careersPage.status.toLowerCase().replace("unfortunately ", "")}</h2>
            </Appear>
          </div>
          <div className="flex flex-1 flex-col gap-5 tablet:max-w-[560px]">
            <Appear delay={0.2}>
              <p className="body">{careersPage.copy}</p>
            </Appear>
            <Appear delay={0.3} className="flex flex-wrap gap-2.5">
              <Button label={careersPage.email} href={`mailto:${careersPage.email}`} />
              <Button label="Meet the team" href="/our-staff" variant="secondary" />
            </Appear>
          </div>
        </div>
      </section>
      <Features />
    </main>
  );
}
