"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
 * The stage is held by CSS `position: sticky` rather than a ScrollTrigger
 * pin, and the runway below it is what the scroll spends. The runway is one
 * screen (the stage) plus the scrub distance, so the film finishes at the
 * exact moment the stage releases — after which the page below simply
 * scrolls up past it, like any other section. Three screens of scrub on
 * desktop play the film at a walking pace. ScrollTrigger therefore only
 * scrubs the playhead; it moves nothing. Under prefers-reduced-motion the
 * poster sits still and nothing scrubs.
 *
 * Mobile (<768px) gets a 1440x810 encode half the size and a 140vh
 * scrub instead of 300vh — the same motion, less of it, per the house rule
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
  // `reduced` is false on the server and only true once the client has read
  // the media query, so keying the markup off it directly made the server
  // send a <video> and the client hydrate an <Image> — a hydration mismatch
  // that threw away the server HTML for this subtree. useMobile is null until
  // the client has read its own media queries, which is the same moment, so
  // it doubles as the mount signal and no extra state is needed.
  const stillFrame = mobile !== null && reduced;

  // The film is by far the heaviest thing on the site — ten megabytes against
  // a seventy-kilobyte poster — and the poster is the page's largest paint.
  // Waiting for `load` was not enough: the fetch still landed inside the
  // window Lighthouse measures, where on throttled mobile it was the single
  // largest transfer on the page and dragged LCP and TBT with it.
  //
  // So the element holds `preload="none"` until the reader shows intent to
  // move — a scroll, a wheel, a touch, a key — with an idle timeout as the
  // backstop for someone who simply sits on the hero. Nothing is lost: the
  // first frame the scrub needs is a scroll away, not a paint away, and a
  // reader who never scrolls never pays for the film at all.
  const [buffer, setBuffer] = useState(false);
  useEffect(() => {
    if (mobile === null || buffer) return;
    let timer = 0;
    const start = () => { cancel(); setBuffer(true); };
    const events = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"] as const;
    const cancel = () => {
      window.clearTimeout(timer);
      for (const e of events) window.removeEventListener(e, start);
    };
    for (const e of events) window.addEventListener(e, start, { once: true, passive: true });
    // Backstop: buffer anyway once the page has been quiet for a moment, so a
    // reader who pauses on the hero is not waiting when they do scroll.
    const arm = () => { timer = window.setTimeout(start, 2500); };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return cancel;
  }, [mobile, buffer]);

  // Children added after parse do not trigger a load on their own.
  useEffect(() => { if (buffer) video.current?.load(); }, [buffer]);

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
        // The film scrubs across exactly the distance the sticky stage is held
        // over: the section's height less the one screen the stage occupies.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: isMobile ? "+=140%" : "+=300%",
            scrub: 0.8,
            onUpdate: (self) => seekTo(self.progress * v.duration),
          },
        });
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
    <section ref={wrap} data-hero-runway className="relative z-0 h-[240svh] md:h-[400svh]" aria-labelledby="hero-heading">
      <div ref={stage} data-hero-stage className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden bg-ink">
        {/* The film, full-bleed. The poster is a real <img> underneath rather
            than the video's `poster` attribute: it is the largest thing on the
            opening screen, so it should be the page's largest paint, and an
            <img> is a first-class LCP candidate that the browser can preload
            at high priority and paint at first contentful paint. Left as a
            `poster` attribute the paint waits on the video element, and the
            metric drifted onto the header wordmark several seconds later. */}
        <div data-hero-plate className="absolute inset-0">
          <Image
            src="/video/hero-poster.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            quality={85}
            sizes="100vw"
            className="object-cover"
          />
          {stillFrame ? null : (
            <video
              ref={video}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              playsInline
              preload={buffer ? "auto" : "none"}
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
