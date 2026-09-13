import Image from "next/image";
import { serviceHours } from "@/lib/site";
import type { SiteImage } from "@/lib/images";
import { HeroSceneLoader } from "@/components/hero-scene-loader";
import { HeroCopy } from "@/components/hero-copy";

/**
 * HERO — the template's composition: a centred two-line display headline
 * beneath the announcement strip and navigation, with the drink sitting in
 * a wide rounded plate that rises into the headline.
 *
 * The headline is the LCP element. It is server-rendered, paints
 * immediately and is never gated behind the scene. The plate is designed
 * CSS (a raked warm light, a blush pool, the paper edge) so it costs
 * nothing over the wire; if the café's counter photograph is present it
 * sits behind the drink at low opacity.
 */
export function Hero({ plate }: { plate: SiteImage | null }) {
  return (
    <section
      className="relative isolate overflow-hidden pt-32 sm:pt-36 lg:pt-44"
      aria-labelledby="hero-heading"
    >
      {/* Ambient wash behind the whole hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 0%, rgba(240,181,144,0.26) 0%, rgba(240,181,144,0.06) 45%, transparent 70%), radial-gradient(40% 40% at 8% 90%, rgba(234,208,198,0.55) 0%, transparent 65%), radial-gradient(40% 40% at 92% 85%, rgba(234,208,198,0.45) 0%, transparent 65%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center px-6 sm:px-10 lg:px-16">
        <HeroCopy />

        {/* ---------- The plate ---------- */}
        <div className="relative mt-12 w-full max-w-[1100px] sm:mt-14 lg:-mt-2">
          <div className="bezel">
            <div className="bezel-core relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[16/9]">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(165deg, #fbf3ea 0%, #f4e3d5 45%, #ead0c6 100%)",
                }}
              />
              {plate ? (
                <Image
                  src={plate.src}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1100px) 1100px, 100vw"
                  className="object-cover opacity-[0.24] mix-blend-multiply"
                />
              ) : null}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(45% 55% at 50% 12%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.15) 45%, transparent 70%), radial-gradient(50% 26% at 50% 96%, rgba(91,42,58,0.18) 0%, transparent 70%)",
                }}
              />
              {/* Hairline ellipse — the saucer the drink sits on. */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-[80%] h-[10%] w-[46%] -translate-x-1/2 rounded-[100%] border border-espresso/10 sm:w-[30%]"
              />

              <HeroSceneLoader />

              {/* Caption chips, as the template's tags. */}
              <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-espresso/10 bg-cream/85 px-3 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-espresso-soft backdrop-blur-sm sm:bottom-5 sm:left-5">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-matcha" />
                Iced matcha latte · £4.50
              </div>
              <p className="pointer-events-none absolute bottom-4 right-4 hidden rounded-full border border-espresso/10 bg-cream/85 px-3 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-mocha backdrop-blur-sm sm:bottom-5 sm:right-5 sm:block">
                Drag to turn
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 pb-16 text-center text-sm text-mocha lg:pb-24">
          Food {serviceHours.food.display} · Evening menu {serviceHours.evening.display.toLowerCase()}
        </p>
      </div>
    </section>
  );
}
