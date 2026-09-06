import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { brands } from "@/lib/content";

/**
 * The brands stocked, running as a marquee.
 *
 * Every brand in `content.ts` carries a `mark` field. While it is null the
 * name is set as a letter-spaced wordmark; once the real SVGs are dropped
 * into /public/images/brands and the `mark` paths are filled in, the same
 * rows render the real marks and nothing else here changes.
 *
 * The whole strip is aria-hidden and duplicated visually by the slider, so a
 * screen reader gets the single readable list below it instead of each brand
 * name announced twice in a row.
 */
export function BrandMarquee() {
  return (
    <section
      aria-labelledby="brands-heading"
      className="border-y border-obsidian-line bg-obsidian py-12 sm:py-16"
    >
      <h2 id="brands-heading" className="sr-only">
        Brands we stock
      </h2>

      <p className="eyebrow mb-10 text-center">Bought, sold and part-exchanged</p>

      <div aria-hidden="true">
        <InfiniteSlider
          gap={72}
          duration={38}
          durationOnHover={90}
          className="edge-fade"
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex h-12 shrink-0 items-center justify-center"
            >
              {brand.mark ? (
                /* unoptimized: these are already vector. Next's image
                   optimizer refuses SVG unless dangerouslyAllowSVG is set,
                   and turning that on for the whole app to raster a file
                   that needs no rasterising is the wrong trade. */
                <Image
                  src={brand.mark}
                  alt=""
                  width={200}
                  height={48}
                  unoptimized
                  className="h-6 w-auto opacity-55 transition-opacity duration-500 hover:opacity-100 sm:h-7"
                />
              ) : (
                <span className="whitespace-nowrap text-[0.9375rem] font-medium uppercase tracking-[0.32em] text-bone-muted transition-colors duration-500 hover:text-bone">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </InfiniteSlider>
      </div>

      {/* The accessible equivalent of the marquee above. */}
      <ul className="sr-only">
        {brands.map((brand) => (
          <li key={brand.name}>{brand.name}</li>
        ))}
      </ul>
    </section>
  );
}
