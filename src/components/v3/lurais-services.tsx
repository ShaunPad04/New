import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content";
import { resolveServiceImage } from "@/lib/work-image";
import { Reveal } from "@/components/reveal";
import { BracketLink, Dots, GutterWord, SectionRule } from "./lurais-parts";
import { StripeLabel } from "@/components/nocta-ui";

/**
 * 05 /SERVICES — Lurais's service list: a big title and one line per
 * service on the left, its image on the right, hairlines between. Every row
 * is a real link to the service's own page (`Service.page`), so the list is
 * navigation as well as a menu.
 *
 * Type is Nocta's (Brad, 2026-09-26, option C of four rendered): each
 * index sits in the striped bracket label, the name is tight semibold caps
 * like the case-study titles, and the stills are square-framed.
 */
export function LuraisServices() {
  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-24 bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
        <SectionRule index="05" label="Services" />
      </div>
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-6 pb-24 pt-16 sm:px-8 lg:grid-cols-[14rem_1fr] lg:pb-32 lg:pt-24">
        <GutterWord>What we do</GutterWord>
        <div>
          <h2 id="services-heading" className="display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] text-ink-1000">
            <Dots />
            Services
          </h2>
          <ul className="mt-14 border-t border-ink-300">
            {services.map((s) => {
              const img = resolveServiceImage(s.id);
              return (
                <li key={s.id} className="border-b border-ink-300">
                  <Reveal variant="settle">
                    <Link
                      href={`/services/${s.page}`}
                      className="group grid items-center gap-6 py-8 sm:grid-cols-[1fr_13rem] lg:gap-12 lg:py-10"
                    >
                      <div>
                        <StripeLabel>/{s.index}/</StripeLabel>
                        <h3 className="mt-5 text-[clamp(1.75rem,3.4vw,3rem)] font-semibold uppercase leading-[0.95] tracking-[-0.045em] text-ink-1000 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-2">
                          {s.title}
                        </h3>
                        <p className="mt-3 max-w-[56ch] text-[0.9375rem] leading-relaxed text-ink-700">{s.summary}</p>
                      </div>
                      {img ? (
                        <div className="relative hidden aspect-[4/3] overflow-hidden border border-ink-300 bg-ink-200 sm:block">
                          <Image
                            src={img}
                            alt=""
                            fill
                            sizes="13rem"
                            className="object-cover grayscale transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 motion-reduce:scale-100!"
                          />
                        </div>
                      ) : null}
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          <div className="mt-14">
            <BracketLink href="/services">All services</BracketLink>
          </div>
        </div>
      </div>
    </section>
  );
}
