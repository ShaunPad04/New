import { closingCta } from "@/lib/content";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";

/**
 * Closing CTA — reference: centred eyebrow, 48px heading and 18px copy in
 * a 600px column with the black button below, then the full-bleed image
 * band (16px margins) that leads into the footer.
 */
export function ClosingCta() {
  return (
    <section className="section pb-4" aria-labelledby="cta-heading">
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-4 px-5 text-center">
        <Appear><p className="eyebrow">{closingCta.eyebrow}</p></Appear>
        <Appear delay={0.1}><h2 id="cta-heading" className="h-section">{closingCta.heading}</h2></Appear>
        <Appear delay={0.2}><p className="lede">{closingCta.copy}</p></Appear>
        <Appear delay={0.3} className="mt-2 flex flex-wrap justify-center gap-3">
          <Button href={closingCta.primary.href}>{closingCta.primary.label}</Button>
          <Button href={closingCta.secondary.href} variant="secondary">{closingCta.secondary.label}</Button>
        </Appear>
      </div>
    </section>
  );
}
