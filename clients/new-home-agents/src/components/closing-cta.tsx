import { closingCta } from "@/lib/content";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { Sky } from "@/components/clouds";

/**
 * Closing CTA — a full-bleed sky panel with 16px margins and 20px radius;
 * centred eyebrow, 48px heading, 18px copy and the button pair, clouds
 * drifting through the plate, leading straight into the dark footer. Brad
 * asked for the photograph that used to fill the lower half to go.
 */
export function ClosingCta() {
  return (
    <section className="px-4 pb-4 pt-8" aria-labelledby="cta-heading">
      <Sky className="rounded-[20px]">
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 px-5 py-20 text-center md:py-28">
          <Appear><p className="eyebrow">{closingCta.eyebrow}</p></Appear>
          <Appear delay={0.1}><h2 id="cta-heading" className="h-section">{closingCta.heading}</h2></Appear>
          <Appear delay={0.2}><p className="lede">{closingCta.copy}</p></Appear>
          <Appear delay={0.3} className="mt-2 flex flex-wrap justify-center gap-3">
            <Button href={closingCta.primary.href}>{closingCta.primary.label}</Button>
            <Button href={closingCta.secondary.href} variant="white">{closingCta.secondary.label}</Button>
          </Appear>
        </div>
      </Sky>
    </section>
  );
}
