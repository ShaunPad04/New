import { Reveal } from "@/components/reveal";
import { EditorialTestimonials } from "@/components/ui/editorial-testimonial";

export function Testimonials() {
  return (
    <section
      aria-labelledby="reviews-heading"
      className="border-t border-obsidian-line bg-obsidian py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="rule-accent mb-8 w-24" />
          <p className="eyebrow mb-5">In their words</p>
          <h2 id="reviews-heading" className="display-lg max-w-3xl text-bone">
            What our clients say.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <EditorialTestimonials />
        </Reveal>
      </div>
    </section>
  );
}
