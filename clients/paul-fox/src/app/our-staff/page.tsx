import type { Metadata } from "next";
import { allStaff } from "@/lib/staff";
import { staffPage } from "@/lib/pages";
import { upload } from "@/lib/assets";
import { PageHeader } from "@/components/page-header";
import { StaffDirectory } from "@/components/staff-directory";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Our Team",
  description: staffPage.copy,
};

export default function StaffPage() {
  return (
    <main>
      <PageHeader eyebrow={staffPage.eyebrow} title={staffPage.title} copy={staffPage.copy} image={upload("2022/04/Paul-liam-Ryan-1.jpg")} imagePosition="object-top" />
      <section className="section">
        <div className="container">
          <StaffDirectory staff={allStaff} filters={staffPage.filters} />
        </div>
      </section>
      <CtaBand
        eyebrow="[ CAREERS ]"
        title="join the family"
        copy="We are always happy to hear from people who want to work in property. Send a covering letter and CV to our Scunthorpe office."
        ctas={[{ label: "Careers", href: "/careers" }]}
      />
    </main>
  );
}
