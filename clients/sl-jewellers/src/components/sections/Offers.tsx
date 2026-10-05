import Image from "next/image";
import Link from "next/link";
import { OFFERS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Parallax from "@/components/motion/Parallax";
import MagneticButton from "@/components/motion/MagneticButton";

/**
 * "What we do": one band per offer (buying and selling, sourcing and made to
 * order, repairs and soldering), photo one side and the words the other,
 * swapping sides as you go down, each with its own short FAQ. Every word is
 * from content/offers.json, which traces each claim to the client.
 */
export default function Offers() {
  return (
    <section id="what-we-do" className="on-black section faq" aria-labelledby="offers-title">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">What we do</p>
          <SplitHeading id="offers-title" text={"Over the counter,\n*the whole lot.*"} className="display-l mt-3" />
        </Reveal>

        <div className="mt-12 grid gap-16 md:gap-24">
          {OFFERS.map((o, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={o.slug} as="article" className="offer grid items-center gap-8 md:grid-cols-2 md:gap-14" id={o.slug} aria-labelledby={`${o.slug}-title`}>
                <div className={`card bg-graphite ${flip ? "md:order-2" : ""}`}>
                  <Parallax className="relative aspect-[4/3]" strength={24}>
                    <Image src={o.image} alt={o.alt} fill sizes="(min-width: 768px) 46vw, 92vw" className="object-cover" loading="lazy" />
                  </Parallax>
                </div>
                <div>
                  <p className="eyebrow">{o.eyebrow}</p>
                  <SplitHeading as="h3" id={`${o.slug}-title`} text={o.title} className="display-s mt-3" />
                  {o.paragraphs.map((p) => (
                    <p key={p} className="mt-4 max-w-[52ch] text-paper/80">
                      {p}
                    </p>
                  ))}
                  {o.quote && (
                    <figure className="mt-5 max-w-[52ch] border-l-2 border-gold pl-4">
                      <blockquote className="text-paper/85">&ldquo;{o.quote.text}&rdquo;</blockquote>
                      <figcaption className="mt-2 text-sm text-wall">
                        {o.quote.name} · {o.quote.platform} review
                      </figcaption>
                    </figure>
                  )}
                  <div className="mt-6 max-w-[52ch]">
                    {o.faqs.map((f, n) => (
                      <details key={f.q} name={`offer-${o.slug}`}>
                        <summary>
                          <span className="n" aria-hidden="true">{String(n + 1).padStart(2, "0")}</span>
                          <span>{f.q}</span>
                          <span className="plus" aria-hidden="true" />
                        </summary>
                        <div className="panel">
                          <div>
                            <p>{f.a}</p>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <MagneticButton>
                      <Link href={o.cta.href} className="btn btn-metal">{o.cta.label}</Link>
                    </MagneticButton>
                    {o.cta2 && (
                      <Link href={o.cta2.href} className="btn btn-ghost">{o.cta2.label}</Link>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
