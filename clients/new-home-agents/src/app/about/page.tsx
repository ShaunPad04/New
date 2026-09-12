import type { Metadata } from "next";
import Image from "next/image";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { Faq } from "@/components/faq";
import { ClosingCta } from "@/components/closing-cta";
import { about, aboutStatement, affiliations, agencyFigures, intro, site } from "@/lib/content";
import { getAllProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "About New Home Agents",
  description: "New Home Agents has been helping people move for over 12 years from its Leeds head office — specialists in new homes, part exchange and assisted move sales for the UK's house builders.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const pics = getAllProperties().filter((p) => p.images.length >= 3).slice(0, 4);
  const [a, b, c] = pics;
  return (
    <main id="main">
      <section className="pt-[140px] pb-12 md:pt-[180px] md:pb-20">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-[50px]">
          <div className="flex flex-col gap-6">
            <Appear><p className="eyebrow">About us</p></Appear>
            <Appear delay={0.1}><h1 className="h-page">Helping people move home for over 12 years</h1></Appear>
            <Appear delay={0.2}><p className="lede">{about.paragraphs[0]}</p></Appear>
            <Appear delay={0.3} className="relative aspect-[603/326] overflow-hidden rounded-[20px] bg-mist">
              {a?.images[1] ? <Image src={a.images[1].src} alt={a.images[1].alt} fill quality={85} sizes="(max-width: 1023px) 100vw, 603px" className="object-cover" /> : null}
            </Appear>
          </div>
          <div className="flex flex-col gap-[30px]">
            <Appear delay={0.15} className="relative aspect-[603/521] overflow-hidden rounded-[20px] bg-mist">
              {b?.images[0] ? <Image src={b.images[0].src} alt={b.images[0].alt} fill priority sizes="(max-width: 1023px) 100vw, 603px" className="object-cover" /> : null}
            </Appear>
            <Appear delay={0.25} className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <p className="h-label text-ink">Memberships</p>
              {affiliations.map((x) => <Image key={x.name} src={x.src} alt={x.name} width={110} height={40} className="h-8 w-auto opacity-70 grayscale" />)}
            </Appear>
          </div>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="container grid gap-8 md:grid-cols-2 md:gap-16">
          <Appear><h2 className="h-card">{aboutStatement}</h2></Appear>
          <Appear delay={0.1} className="flex flex-col gap-4 text-lg text-slate">
            {about.paragraphs.slice(1, 4).map((p) => <p key={p}>{p}</p>)}
          </Appear>
        </div>
      </section>

      <section className="relative">
        <div className="relative aspect-[1440/800] min-h-[560px] w-full overflow-hidden bg-ink">
          {c?.images[0] ? <Image src={c.images[0].src} alt={c.images[0].alt} fill sizes="100vw" className="object-cover" /> : null}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="container grid gap-4 py-8 md:grid-cols-2 md:gap-8">
              <Appear className="rounded-[15px] bg-ink/40 p-[25px] text-white backdrop-blur-sm">
                <h2 className="h-sub text-white">Our mission</h2>
                <p className="mt-3 text-lg text-cloud">{about.paragraphs[0].split("Our mission is ")[1]?.replace(/^./, (ch) => ch.toUpperCase())}</p>
              </Appear>
              <Appear delay={0.1} className="rounded-[15px] bg-ink/40 p-[25px] text-white backdrop-blur-sm">
                <h2 className="h-sub text-white">Where we work</h2>
                <p className="mt-3 text-lg text-cloud">{about.paragraphs[4]}</p>
              </Appear>
            </div>
          </div>
        </div>
      </section>

      {/* The welcome copy the agency publishes on its homepage — moved here from ours at Brad's request, condensed. */}
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-16">
          <div>
            <Appear><p className="eyebrow">What we do</p></Appear>
            <Appear delay={0.1}><h2 className="h-section mt-4">{intro.heading}</h2></Appear>
            <Appear delay={0.2}><p className="lede mt-5">{intro.paragraphs[0]}</p></Appear>
          </div>
          <Appear delay={0.15}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {intro.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 rounded-[12px] bg-mist px-4 py-3 text-ink">
                  <span aria-hidden="true" className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-ink" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </Appear>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid gap-[10px] md:grid-cols-3">
            {agencyFigures.map((f, i) => (
              <Appear key={f.label} delay={i * 0.1} className="rounded-[10px] bg-mist p-[25px]">
                <p className="text-[44px] font-semibold leading-none tracking-tight">{f.value.toLocaleString("en-GB")}{f.suffix}</p>
                <p className="mt-3 text-lg font-medium">{f.label}</p>
                <p className="mt-1 text-xs text-slate">{f.source}</p>
              </Appear>
            ))}
          </div>
          <Appear className="mt-10 flex flex-col gap-4 rounded-[20px] bg-ink p-8 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <p className="h-sub text-white">{site.headOffice.label}</p>
              <p className="mt-2 text-cloud">{site.headOffice.lines.join(", ")} · {site.openingHours}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact" variant="white">Contact us</Button>
              <Button href={site.phoneHref} variant="secondary" arrow={false}>{site.phone}</Button>
            </div>
          </Appear>
        </div>
      </section>
      <Faq />
      <ClosingCta />
    </main>
  );
}
