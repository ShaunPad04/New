import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { lettingsPage } from "@/lib/pages";
import { lettingsProperties } from "@/lib/properties";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { Features } from "@/components/features";
import { TeamRow } from "@/components/team-row";
import { PropertyCard } from "@/components/property-card";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Letting Agents",
  description: lettingsPage.copy[0],
};

export default function LettingsPage() {
  return (
    <main>
      <PageHeader eyebrow={lettingsPage.eyebrow} title={lettingsPage.title} copy={lettingsPage.lede} image={upload(lettingsPage.image)} ctas={lettingsPage.ctas.slice(0, 2)} />

      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-3">
            <Appear>
              <p className="caption2">[ YOUR LETTINGS PARTNER ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">over 50 years’ combined experience</h2>
            </Appear>
          </div>
          <div className="flex flex-1 flex-col gap-5 tablet:max-w-[560px]">
            {lettingsPage.copy.map((p, i) => (
              <Appear key={i} delay={0.2 + i * 0.1}>
                <p className="body">{p}</p>
              </Appear>
            ))}
            <Appear delay={0.5}>
              <p className="caption">{lettingsPage.cmp}</p>
            </Appear>
            <Appear delay={0.5} className="flex flex-wrap gap-2.5">
              {lettingsPage.ctas.map((c, i) => (
                <Button key={c.href} label={c.label} href={c.href} variant={i === 0 ? "primary" : "secondary"} />
              ))}
            </Appear>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex items-end justify-between gap-5">
            <div className="flex flex-col gap-3">
              <Appear>
                <p className="caption2">[ TO LET ]</p>
              </Appear>
              <Appear delay={0.1}>
                <h2 className="h2">latest rental properties</h2>
              </Appear>
            </div>
            <Appear delay={0.2}>
              <Button label="view all" href="/search-results?department=residential-lettings" />
            </Appear>
          </div>
          <Appear delay={0.3} className="grid grid-cols-1 gap-5 tablet:grid-cols-3">
            {lettingsProperties.slice(0, 6).map((p, i) => (
              <PropertyCard key={p.slug} property={p} index={i} />
            ))}
          </Appear>
        </div>
      </section>

      <Features />
      <TeamRow title="meet the paul fox lettings team" slugs={lettingsPage.team} />
      <CtaBand
        eyebrow="[ LANDLORDS ]"
        title="let your property without the hassle"
        copy="From a free rental valuation to full management, our standalone lettings office on Oswald Road has it covered."
        ctas={[
          { label: "Let my property", href: "/valuation-request" },
          { label: "Lettings fees", href: "/letting-agents/lettings-fees" },
          { label: "Lettings office", href: "/office/lettings" },
        ]}
      />
    </main>
  );
}
