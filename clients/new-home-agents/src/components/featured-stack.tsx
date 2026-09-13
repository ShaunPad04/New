import Image from "next/image";
import type { Property } from "@/lib/properties";
import { formatPrice } from "@/lib/properties";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/button";

/**
 * "Top properties" — the reference's signature move: three full-viewport
 * photographs, each `position: sticky; top: 0`, so every card slides up over
 * the one before it. Centred on each: a translucent ink panel (15px radius,
 * 40px padding) with the price in a pill, the 34px title, the address and a
 * light "Explore" button. Pure CSS sticky — no scroll JS.
 */
export function FeaturedStack({ properties }: { properties: Property[] }) {
  return (
    <section className="relative z-10 bg-white" aria-labelledby="featured-heading">
      <div className="container pt-20">
        <SectionHeading
          eyebrow="Featured properties"
          title="A closer look at homes listed with us"
          description="Real listings from our current portfolio — new homes and resale properties across the UK."
        />
      </div>
      <div className="mt-16">
        {properties.map((p, i) => {
          const img = p.images[0];
          const price = formatPrice(p);
          return (
            <article key={p.id} className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink text-white" aria-labelledby={`featured-${p.id}`}>
              {img ? (
                <Image src={img.src} alt={img.alt} fill quality={85} sizes="100vw" priority={i === 0} className="object-cover" />
              ) : null}
              <div aria-hidden="true" className="absolute inset-0 bg-ink/30" />
              <div className="absolute inset-0 flex items-center justify-center px-5">
                <div className="flex max-w-[420px] flex-col items-center gap-3 rounded-[15px] bg-ink-deep/35 px-8 pb-8 pt-0 text-center backdrop-blur-[2px] md:px-10 md:pb-10">
                  <p className="-mt-3 rounded-b-[10px] bg-ink-deep/45 px-4 py-1.5 text-lg font-medium text-cloud">
                    {price.qualifier ? <span className="mr-1 text-sm">{price.qualifier}</span> : null}{price.amount}
                  </p>
                  <h3 id={`featured-${p.id}`} className="h-card text-white">{p.title.split(",")[0]}</h3>
                  <p className="text-base font-medium text-cloud">{p.area || p.town}{p.beds ? ` · ${p.beds} bed` : ""}{p.isNewHome ? " · New home" : ""}</p>
                  <Button href={`/properties/${p.slug}`} variant="secondary" className="mt-2">Explore</Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
