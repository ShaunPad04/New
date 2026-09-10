import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { sellPage } from "@/lib/pages";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { Features } from "@/components/features";
import { Testimonials } from "@/components/testimonials";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Sell Your Property",
  description: sellPage.copy[0],
};

export default function SellPage() {
  return (
    <main>
      <PageHeader
        eyebrow={sellPage.eyebrow}
        title={sellPage.title}
        image={upload(sellPage.image)}
        ctas={[sellPage.cta, sellPage.finest]}
      />

      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-3">
            <Appear>
              <p className="caption2">[ HOW WE SELL ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">from valuation to keys</h2>
            </Appear>
          </div>
          <div className="flex flex-1 flex-col gap-5 tablet:max-w-[560px]">
            {sellPage.copy.map((p, i) => (
              <Appear key={i} delay={0.2 + i * 0.1}>
                <p className="body">{p}</p>
              </Appear>
            ))}
            <Appear delay={0.4} className="flex flex-wrap gap-2.5">
              <Button label={sellPage.cta.label} href={sellPage.cta.href} />
              <Button label={sellPage.conveyancing.label} href={sellPage.conveyancing.href} variant="secondary" />
            </Appear>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-4">
          {sellPage.steps.map((s, i) => (
            <Appear key={s.number} delay={i * 0.1}>
              <div className="flex h-full flex-col gap-10 plate p-5">
                <p className="caption2 border-b border-ink-200 pb-5">[ {s.number} ]</p>
                <div className="flex flex-col gap-2">
                  <h3 className="h5">{s.title}</h3>
                  <p className="body-sm">{s.text}</p>
                </div>
              </div>
            </Appear>
          ))}
        </div>
      </section>

      <Testimonials />
      <Features />
      <CtaBand
        eyebrow="[ FREE VALUATION ]"
        title="what is your home worth?"
        copy="An accurate, individual valuation from a regional valuer who knows your street — free and with no obligation."
        ctas={[sellPage.cta, { label: "Contact us", href: "/contact" }]}
      />
    </main>
  );
}
