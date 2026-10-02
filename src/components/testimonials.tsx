import { PLACEHOLDER_TESTIMONIALS, SHOW_TESTIMONIALS } from "@/lib/content";
import { TestimonialsCarousel } from "./testimonials-carousel";

/** Server half: nothing ships until `SHOW_TESTIMONIALS` (real, permissioned quotes). */
export function Testimonials() {
  return <TestimonialsCarousel items={SHOW_TESTIMONIALS ? PLACEHOLDER_TESTIMONIALS : []} />;
}
