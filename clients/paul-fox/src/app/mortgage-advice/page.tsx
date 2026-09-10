import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { mortgagePage } from "@/lib/pages";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { EnquiryForm } from "@/components/enquiry-form";
import { Features } from "@/components/features";

export const metadata: Metadata = {
  title: "Mortgage Advice",
  description: mortgagePage.copy[0],
};

export default function MortgagePage() {
  return (
    <main>
      <PageHeader eyebrow={mortgagePage.eyebrow} title={mortgagePage.title} copy={mortgagePage.lede} image={upload(mortgagePage.image)} compact />
      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <Appear>
              <p className="caption2">[ IN PARTNERSHIP WITH RIACH FINANCIAL LTD ]</p>
            </Appear>
            {mortgagePage.copy.map((p, i) => (
              <Appear key={i} delay={0.1 + i * 0.1}>
                <p className="body">{p}</p>
              </Appear>
            ))}
            <Appear delay={0.4} className="flex flex-col gap-3 rounded-lg bg-ink-50 p-5">
              {mortgagePage.smallPrint.map((p, i) => (
                <p key={i} className="caption">
                  {p}
                </p>
              ))}
            </Appear>
          </div>
          <Appear delay={0.2} className="flex-1 tablet:max-w-[560px]">
            <EnquiryForm
              label="Mortgage enquiry form"
              fields={[
                { name: "name", label: "Name", required: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
                { name: "phone", label: "Telephone", type: "tel", required: true, autoComplete: "tel" },
                { name: "status", label: "I am", type: "select", required: true, options: ["A first-time buyer", "Moving home", "Remortgaging", "A landlord / buy-to-let"] },
                { name: "message", label: "Message", type: "textarea" },
              ]}
              consent={mortgagePage.consent}
              submit="Contact mortgage team"
              sent="Request sent"
            />
          </Appear>
        </div>
      </section>
      <Features />
    </main>
  );
}
