import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { valuationPage } from "@/lib/pages";
import { offices } from "@/lib/content";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "Book a Free Valuation",
  description: valuationPage.copy,
};

export default function ValuationPage() {
  return (
    <main>
      <PageHeader eyebrow={valuationPage.eyebrow} title={valuationPage.title} copy={valuationPage.copy} image={upload(valuationPage.image)} compact />
      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <Appear>
              <p className="caption2">[ WHAT HAPPENS NEXT ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">free, individual, no obligation</h2>
            </Appear>
            <Appear delay={0.2}>
              <p className="body">
                We will call to arrange a convenient time. One of our regional valuers will visit, value your property individually and talk you through
                the local market, the target buyer or tenant, and how we would present your home.
              </p>
            </Appear>
            <Appear delay={0.3} className="flex flex-col gap-2 plate p-5">
              <p className="caption2">[ OR CALL YOUR LOCAL BRANCH ]</p>
              {offices
                .filter((o) => o.href.startsWith("/office"))
                .map((o) => (
                  <a key={o.name} href={`tel:${o.phone.replace(/\s/g, "")}`} className="flex items-center justify-between border-t border-ink-200 pt-2">
                    <span className="body-sm !text-ink-900">{o.name}</span>
                    <span className="caption2">{o.phone}</span>
                  </a>
                ))}
            </Appear>
          </div>
          <Appear delay={0.2} className="flex-1 tablet:max-w-[560px]">
            <EnquiryForm
              label="Valuation request form"
              fields={[
                { name: "name", label: "Name", required: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
                { name: "phone", label: "Telephone", type: "tel", required: true, autoComplete: "tel" },
                { name: "address", label: "Property address", required: true, autoComplete: "street-address" },
                { name: "postcode", label: "Postcode", required: true, autoComplete: "postal-code" },
                { name: "purpose", label: "I am looking to", type: "select", required: true, options: ["Sell", "Let", "Not sure yet"] },
                { name: "message", label: "Anything we should know?", type: "textarea" },
              ]}
              submit="Request my valuation"
              sent="Request sent"
            />
          </Appear>
        </div>
      </section>
    </main>
  );
}
