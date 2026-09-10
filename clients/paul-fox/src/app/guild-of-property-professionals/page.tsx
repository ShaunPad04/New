import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { guildPage } from "@/lib/pages";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "The Guild of Property Professionals",
  description: guildPage.intro,
};

export default function GuildPage() {
  return (
    <main>
      <PageHeader eyebrow={guildPage.eyebrow} title={guildPage.title} copy={guildPage.intro} image={upload("2026/03/PFE250159_55.jpg")} />
      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <Appear>
              <img src={upload(guildPage.logo)} alt="The Guild of Property Professionals" className="h-20 w-auto" loading="lazy" />
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">{guildPage.lede.toLowerCase()}</h2>
            </Appear>
            <Appear delay={0.2}>
              <p className="body">{guildPage.intro}</p>
            </Appear>
            <Appear delay={0.3}>
              <Button label={guildPage.link.label} href={guildPage.link.href} external variant="secondary" />
            </Appear>
          </div>
          <div className="flex flex-1 flex-col gap-5 tablet:max-w-[560px]">
            {guildPage.benefits.map((b, i) => (
              <Appear key={b.title} delay={0.2 + i * 0.1}>
                <div className="flex gap-5 border-b border-ink-200 pb-5">
                  <img src={upload(b.icon)} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-[6px] bg-ink-50 object-contain p-1" />
                  <div className="flex flex-col gap-2">
                    <h3 className="h6">{b.title}</h3>
                    <p className="body-sm">{b.text}</p>
                  </div>
                </div>
              </Appear>
            ))}
          </div>
        </div>
      </section>
      <CtaBand
        eyebrow="[ MOVING WITH THE GUILD ]"
        title="the only local estate agents recommended by the guild"
        copy="Sell with us and your home is promoted across the UK network and 24/7 on the touchscreens at Park Lane, London."
        ctas={[{ label: "Book a free valuation", href: "/valuation-request" }, { label: "Selling with us", href: "/sell" }]}
      />
    </main>
  );
}
