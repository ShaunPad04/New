import Image from "next/image";
import { closingCta } from "@/lib/content";
import type { Property } from "@/lib/properties";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { Sky } from "@/components/clouds";

/**
 * Closing CTA — reference: a full-bleed sky panel with 16px margins and
 * 20px radius; centred eyebrow, 48px heading, 18px copy and the black
 * button; a photograph filling the lower half, clouds drifting over it,
 * leading straight into the dark footer.
 */
export function ClosingCta({ photo }: { photo?: Property }) {
  const img = photo?.images[0];
  return (
    <section className="px-4 pb-4 pt-8" aria-labelledby="cta-heading">
      <Sky className="rounded-[20px]">
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 px-5 pt-20 text-center md:pt-24">
          <Appear><p className="eyebrow">{closingCta.eyebrow}</p></Appear>
          <Appear delay={0.1}><h2 id="cta-heading" className="h-section">{closingCta.heading}</h2></Appear>
          <Appear delay={0.2}><p className="lede">{closingCta.copy}</p></Appear>
          <Appear delay={0.3} className="mt-2 flex flex-wrap justify-center gap-3">
            <Button href={closingCta.primary.href}>{closingCta.primary.label}</Button>
            <Button href={closingCta.secondary.href} variant="white">{closingCta.secondary.label}</Button>
          </Appear>
        </div>
        <div className="relative mt-10 aspect-[1408/620] w-full md:mt-14">
          {img ? <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-cover object-top" /> : null}
          <div aria-hidden="true" className="cloud cloud-a !top-[-30%] !left-[-10%] !h-[55%] !w-[60%] !opacity-60" />
          <div aria-hidden="true" className="cloud cloud-b !top-[-35%] !right-[-15%] !h-[55%] !w-[55%] !opacity-50" />
          {photo ? <p className="absolute bottom-4 right-4 rounded-full bg-white/80 px-3 py-1 text-xs text-slate backdrop-blur-sm">Pictured: {photo.title}</p> : null}
        </div>
      </Sky>
    </section>
  );
}
