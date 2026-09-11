"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { hero } from "@/lib/content";
import { useMobile } from "@/lib/use-mobile";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** The film's frame rate — seeks are quantised to it so no two ticks ask for the same frame. */
const FPS = 24;

/**
 * Hero — Brad's film, full-bleed and untouched: no copy over it and no
 * scrim tinting it, because the film is the statement. The page's h1 is
 * still here for screen readers and search engines, visually hidden.
 * ScrollTrigger pins the stage and scrubs the film's playhead to the
 * scrollbar. Under prefers-reduced-motion the poster sits still and nothing
 * is pinned.
 *
 * Mobile (<768px) gets a 720p encode a third of the size and a 120vh scrub
 * runway instead of 200vh — the same motion, less of it, per the house rule
 * on pinned sections on phones.
 *
 * Scrubbing: the film is H.264 with a keyframe every twelve frames and
 * seeks are issued one at a time — see seekTo. HEVC is deliberately not
 * offered here; hardware HEVC decoders stutter on frequent seeks.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mobile = useMobile();

  // Sources are rendered once the viewport is known; tell the element to
  // look at them, since children added after parse do not trigger a load.
  useEffect(() => { if (mobile !== null) video.current?.load(); }, [mobile]);

  // The poster is the first paint of the page; ask for it before the CSS is parsed.
  preload("/video/hero-poster.webp", { as: "image", fetchPriority: "high" });

  useGSAP(
    () => {
      const v = video.current;
      const st = stage.current;
      if (reduced || !v || !st) return;
      // One seek in flight at a time. Scroll ticks arrive faster than a seek
      // can decode, and a browser handed a queue of seeks lands them in
      // bursts — the film jumps between points instead of gliding. Each tick
      // records the frame it wants; the next seek is issued only once the
      // previous has landed, always to the latest frame asked for.
      let wanted = -1;
      let inFlight = false;
      const seekTo = (t: number, force = false) => {
        if (!v.duration) return;
        const frame = Math.round(t * FPS) / FPS;
        if (!force && Math.abs(frame - v.currentTime) < 1 / (FPS * 2)) return;
        if (inFlight || v.seeking) { wanted = frame; return; }
        inFlight = true;
        v.currentTime = frame;
      };
      const onSeeked = () => {
        inFlight = false;
        if (wanted >= 0) { const next = wanted; wanted = -1; seekTo(next); }
      };
      v.addEventListener("seeked", onSeeked);
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
            onUpdate: (self) => seekTo(self.progress * v.duration),
          },
        });
        // Nothing is overlaid, so the timeline exists only to hold the runway
        // open while onUpdate scrubs the film.
        tl.to({}, { duration: 1 }, 0);
        // Forced: an explicit seek after load (and after the primer below) also
        // closes the media fetch that play() opened — Chromium otherwise parks
        // it open in a suspended state, which holds the page short of idle.
        const sync = () => { const s = tl.scrollTrigger; if (s && v.duration) seekTo(s.progress * v.duration, true); };
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
      return () => v.removeEventListener("seeked", onSeeked);
    },
    { scope: wrap, dependencies: [reduced] }
  );

  return (
    <section ref={wrap} className="relative z-0" aria-labelledby="hero-heading">
      <div ref={stage} data-hero-stage className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
        {/* The film, full-bleed. */}
        <div data-hero-plate className="absolute inset-0">
          {reduced ? (
            <Image src="/video/hero-poster.webp" alt="" fill priority quality={85} sizes="100vw" className="object-cover" />
          ) : (
            <video
              ref={video}
              className="absolute inset-0 h-full w-full object-cover"
              poster="/video/hero-poster.webp"
              muted
              playsInline
              preload={mobile === null ? "none" : "auto"}
              aria-hidden="true"
            >
              {/* H.264 only, on purpose: this film is scrubbed, and hardware HEVC decoders
                  flush their pipeline on every seek, which turns a scroll into a stutter.
                  H.264 with a keyframe every twelve frames seeks in a frame or two anywhere. */}
              {mobile === null ? null : (
                <source src={mobile ? "/video/hero-scrub-m.mp4" : "/video/hero-scrub.mp4"} type="video/mp4" />
              )}
              {mobile === null ? null : <source src="/video/hero-scrub.webm" type="video/webm" />}
            </video>
          )}
        </div>

        {/* The page still needs exactly one h1; it is read, not seen. */}
        <h1 id="hero-heading" className="sr-only">{hero.headline}</h1>
      </div>
    </section>
  );
}
