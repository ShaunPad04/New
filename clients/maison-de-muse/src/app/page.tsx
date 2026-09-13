import { resolveGallery, resolveImage } from "@/lib/images";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Intro } from "@/components/intro";
import { MenuPreview } from "@/components/menu-preview";
import { Dayparts } from "@/components/dayparts";
import { Pillars } from "@/components/pillars";
import { Reviews } from "@/components/reviews";
import { GalleryPreview } from "@/components/gallery-preview";
import { Faq } from "@/components/faq";
import { VisitCta } from "@/components/visit-cta";
import { LocalBusinessJsonLd } from "@/components/structured-data";

/**
 * HOME — the template's section order, adapted:
 * hero → ticker → intro → menu preview → day band → pillars → reviews →
 * gallery → FAQ → closing CTA → ticker.
 *
 * Photography is resolved at build time (see lib/images.ts); every section
 * has a designed state for when a file is absent.
 */
export default function Home() {
  const gallery = resolveGallery();

  return (
    <>
      <LocalBusinessJsonLd />
      <main id="main" className="flex-1">
        <Hero plate={resolveImage("hero")} />
        <Marquee />
        <Intro image={resolveImage("intro")} />
        <MenuPreview />
        <Dayparts />
        <Pillars />
        <Reviews />
        <GalleryPreview images={gallery} />
        <Faq />
        <VisitCta left={resolveImage("coffee")} right={resolveImage("evening")} />
        <Marquee tone="dark" />
      </main>
    </>
  );
}
