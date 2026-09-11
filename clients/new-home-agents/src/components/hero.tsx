"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { hero } from "@/lib/content";
import { Button } from "@/components/button";
import { useMobile } from "@/lib/use-mobile";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Hero — Brad's film fills the whole stage from the first frame. The agency
 * name is the statement: set wide and uppercase like the wordmark, it fades
 * in word by word (opacity, a short rise and a blur resolve), then a hairline
 * draws and the strap and buttons follow. That is deliberately the register
 * of a luxury estate agency rather than a startup headline. ScrollTrigger pins the stage for 200vh of scroll
 * and scrubs the film's playhead to the scrollbar while the copy lifts away
 * (public/video/hero-scrub.mp4 is encoded with every frame a keyframe, so
 * seeking is instant). Under prefers-reduced-motion the poster sits still
 * and nothing is pinned.
 *
 * Entrance: words 1.4s power4.out staggered 140ms; rule 0.9s; strap and
 * buttons 1s, staggered 120ms, overlapping the last word.
 *
 * Mobile (<768px) gets a 720p encode a third of the size and a 120vh scrub
 * runway instead of 200vh — the same motion, less of it, per the house rule
 * on pinned sections on phones.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mobile = useMobile();

  // Sources are rendered once the viewport is known; tell the element to
  // look at them, since children added after parse do not trigger a load.
  useEffect(() => { if (mobile !== null) video.current?.load(); }, [mobile]);

  // The poster is the first paint of the page; ask for it before the CSS is parsed.
  preload("/video/hero-poster.jpg", { as: "image", fetchPriority: "high" });

  useGSAP(
    () => {
      const v = video.current;
      const st = stage.current;
      if (reduced || !v || !st) return;
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from("[data-hero-word]", { autoAlpha: 0, y: 28, filter: "blur(14px)", duration: 1.4, stagger: 0.14 }, 0.15)
        .from("[data-hero-rule]", { scaleX: 0, duration: 0.9 }, 0.7)
        .from("[data-hero-rise]", { autoAlpha: 0, y: 20, duration: 1, stagger: 0.12 }, 0.85);
      const mm = gsap.matchMedia();
      mm.add({ isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" }, (ctx) => {
        const { isMobile } = ctx.conditions as { isMobile: boolean };
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: isMobile ? "+=120%" : "+=200%",
            pin: st,
            scrub: 0.6,
            onUpdate: (self) => { if (v.duration) v.currentTime = self.progress * v.duration; },
          },
        });
        // The copy lifts away over the first third of the runway; the rest is the film alone.
        tl.to(copy.current, { y: -80, opacity: 0, ease: "none", duration: 0.3 }, 0).to({}, { duration: 0.7 }, 0.3);
        const sync = () => { const s = tl.scrollTrigger; if (s && v.duration) v.currentTime = s.progress * v.duration; };
        // iOS Safari never decodes a frame of a video that has not played, so a
        // film that is only ever seeked shows its poster for good. A muted,
        // inline play-then-pause is allowed without a tap and primes the decoder.
        const prime = () => {
          const p = v.play();
          if (p) p.then(() => { v.pause(); sync(); }).catch(() => {});
        };
        v.addEventListener("loadedmetadata", sync);
        v.addEventListener("loadeddata", prime, { once: true });
        return () => { v.removeEventListener("loadedmetadata", sync); v.removeEventListener("loadeddata", prime); };
      });
    },
    { scope: wrap, dependencies: [reduced] }
  );

  return (
    <section ref={wrap} className="relative z-0" aria-labelledby="hero-heading">
      <div ref={stage} data-hero-stage className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
        {/* The film, full-bleed. */}
        <div data-hero-plate className="absolute inset-0">
          {reduced ? (
            <Image src="/video/hero-poster.jpg" alt="" fill priority quality={85} sizes="100vw" className="object-cover" />
          ) : (
            <video
              ref={video}
              className="absolute inset-0 h-full w-full object-cover"
              poster="/video/hero-poster.jpg"
              muted
              playsInline
              preload={mobile === null ? "none" : "auto"}
              aria-hidden="true"
            >
              {mobile === null ? null : mobile ? (
                <source src="/video/hero-scrub-m.mp4" type="video/mp4" />
              ) : (
                <source src="/video/hero-scrub.mp4" type="video/mp4" />
              )}
              {mobile === null ? null : <source src="/video/hero-scrub.webm" type="video/webm" />}
            </video>
          )}
          {/* Scrim so the white copy reads over any frame. */}
          <div aria-hidden="true" className="absolute inset-0 bg-ink/35" />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(8,11,15,0.55),transparent_72%)]" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/50 to-transparent" />
        </div>

        <div ref={copy} data-hero-copy className="container relative z-10 flex h-full flex-col items-center justify-center pb-10 pt-[84px] text-center">
          <h1
            id="hero-heading"
            className="max-w-[1100px] text-[clamp(1.75rem,6.4vw,92px)] font-medium uppercase leading-[1.08] tracking-[0.2em] text-white [text-shadow:0_2px_30px_rgba(8,11,15,0.45)]"
          >
            {hero.headline.split(" ").map((word, i) => (
              <span key={i} data-hero-word className="mr-[0.2em] inline-block last:mr-0">
                {word}
              </span>
            ))}
          </h1>
          <span aria-hidden="true" data-hero-rule className="mt-7 block h-px w-14 origin-center bg-white/70" />
          <p data-hero-rise className="mt-6 text-[13px] font-medium uppercase tracking-[0.18em] text-white/85 [text-shadow:0_1px_14px_rgba(8,11,15,0.5)] md:text-sm">
            {hero.strap.map((item, i) => (
              <span key={item} className="inline-block">
                {i > 0 && <span aria-hidden="true" className="mx-3 text-white/45">·</span>}
                <span className="whitespace-nowrap">{item}</span>
              </span>
            ))}
          </p>
          <div data-hero-rise className="mt-8 flex flex-wrap items-center justify-center gap-[10px]">
            <Button href={hero.primary.href} variant="white">{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="outline" arrow={false} className="border-white/60 text-white hover:border-white">{hero.secondary.label}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
