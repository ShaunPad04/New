import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content";
import type { Property } from "@/lib/properties";
import { Appear } from "@/components/appear";
import { SectionHeading } from "@/components/section-heading";

/**
 * Services — reference layout: full-width dark cards stacked one under the
 * other (#080b0f, 24px radius), each with its label and 28px title top-left,
 * the ".01" numeral at 120px top-right, and the photograph centred in the
 * lower area. Every card links to its service page.
 */
export function Services({ images }: { images: (Property | undefined)[] }) {
  return (
    <section className="relative z-10 bg-white" aria-labelledby="services-heading">
      <div className="container section">
        <SectionHeading
          eyebrow="Our services"
          title="Everything you need to move home"
          description="New homes, part exchange, assisted move and selling your existing home — explained in plain English and handled end to end."
        />
        <ul className="mt-16 flex flex-col gap-4">
          {services.map((s, i) => {
            const img = images[i]?.images[0];
            return (
              <Appear key={s.slug} delay={0.05} as="li" className="relative overflow-hidden rounded-[24px] bg-ink text-white">
                <Link href={s.href} className="group relative flex flex-col p-[25px] outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:p-8 lg:p-10">
                  <span aria-hidden="true" className="numeral absolute right-[25px] top-[18px] text-white md:right-8 lg:right-10">.{s.index}</span>
                  <div className="relative z-10 flex max-w-[440px] flex-col gap-2 pr-[120px] md:pr-[180px] lg:pr-0">
                    <p className="text-sm text-cloud">{s.label}</p>
                    <h3 className="h-sub">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-cloud/80">{s.summary}</p>
                    <span className="mt-1 text-sm underline-offset-4 group-hover:underline">{s.cta} →</span>
                  </div>
                  {img ? (
                    <div className="relative mx-auto mt-8 aspect-[16/9] w-full max-w-[820px] overflow-hidden rounded-[16px] bg-ink-deep md:mt-10">
                      <Image
                        src={img.src}
                        alt=""
                        fill
                        quality={85}
                        sizes="(max-width: 1023px) 100vw, 820px"
                        className="object-cover transition-transform duration-[1200ms] ease-out-soft group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                </Link>
              </Appear>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
