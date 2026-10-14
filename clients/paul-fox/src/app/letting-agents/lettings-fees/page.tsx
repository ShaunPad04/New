import type { Metadata } from "next";
import { feesPage } from "@/lib/pages";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Lettings Fees",
  description: "Paul Fox landlord fees in full: superior set-up package, fully managed service, tenant find only and additional services.",
};

export default function FeesPage() {
  return (
    <main>
      <PageHeader eyebrow={feesPage.eyebrow} title={feesPage.title} copy={feesPage.copy} compact />

      <section className="section">
        <div className="container grid grid-cols-1 gap-5 desktop:grid-cols-3">
          {feesPage.packages.map((pkg, i) => (
            <Appear key={pkg.title} delay={i * 0.1} className="flex">
              <div className="flex w-full flex-col gap-5 plate p-5">
                <div className="flex flex-col gap-2 border-b border-ink-200 pb-5">
                  <p className="caption2">[ {String(i + 1).padStart(2, "0")} ]</p>
                  <h2 className="h5">{pkg.title}</h2>
                  <p className="h6 !text-ink-900">{pkg.price}</p>
                  {pkg.note && <p className="caption">{pkg.note}</p>}
                </div>
                {pkg.intro && <p className="body-sm !text-ink-900">{pkg.intro}</p>}
                <ul className="flex flex-col gap-2">
                  {pkg.items.map((item) => (
                    <li key={item} className="body-sm flex gap-2">
                      <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Appear>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-3">
            <Appear>
              <p className="caption2">[ EXTRAS ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">{feesPage.additional.title}</h2>
            </Appear>
          </div>
          <Appear delay={0.2} className="flex-1 tablet:max-w-[640px]">
            <div className="plate px-5 py-2">
              {feesPage.additional.items.map((item, i) => (
                <div key={item.label} className={`flex flex-col gap-1 py-3 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-6 ${i ? "border-t border-ink-200" : ""}`}>
                  <span className="body-sm !text-ink-900">{item.label}</span>
                  <span className="caption2 shrink-0">{item.price}</span>
                </div>
              ))}
            </div>
          </Appear>
        </div>
      </section>

      <CtaBand
        eyebrow="[ TALK TO US ]"
        title="contact the lettings team"
        copy="Not sure which package suits your property? Call 01724 282868 or email lettings@paul-fox.com and we will talk it through."
        ctas={[
          { label: "Let my property", href: "/valuation-request" },
          { label: "Lettings office", href: "/office/lettings" },
        ]}
      />
    </main>
  );
}
