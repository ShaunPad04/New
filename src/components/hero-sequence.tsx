"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SCROLL-DRIVEN HERO FRAME SEQUENCE
 *
 * An Apple-style pinned hero where scroll position — not a video clock — owns
 * animation progress. Scrolling forward advances the sequence, scrolling back
 * reverses it, and stopping freezes on the exact corresponding frame.
 *
 * WHY AN IMAGE SEQUENCE RATHER THAN <video> currentTime SCRUBBING
 *
 * The source encodes 169 frames as a SINGLE GOP: 1 I-frame, 67 P-frames and
 * 101 B-frames. There is exactly one keyframe, at frame 0. Seeking to frame N
 * therefore forces the decoder to walk forward from the very beginning every
 * time, and B-frames mean decode order differs from display order, so reverse
 * scrubbing re-decodes long runs repeatedly. Browsers also snap `currentTime`
 * to whatever they can decode, which makes "freeze on the exact frame"
 * unachievable and varies between Chromium and Safari. A decoded image
 * sequence sidesteps all of it: frame N is a direct array lookup.
 *
 * DELIVERY
 *   desktop  169 frames @ 1440w WebP  ~5.8 MB
 *   mobile    85 frames @  780w WebP  ~1.2 MB (every 2nd frame)
 * Both are smaller than the 25.9 MB source MP4.
 *
 * ACCESSIBILITY
 * Under `prefers-reduced-motion` the sequence never mounts. A single static
 * frame renders instead, the section does not pin, and no frames are fetched.
 * Content is never gated behind the animation.
 */

const DESKTOP_FRAMES = 169;
const MOBILE_FRAMES = 85;

/** Frame shown when motion is reduced — the goggle close-up, the strongest single still. */
const POSTER_INDEX = 96;

const framePath = (tier: "d" | "m", i: number) =>
  `/hero-frames/${tier}/${String(i).padStart(3, "0")}.webp`;

/** Frames fetched before the sequence is allowed to start, so it never flashes blank. */
const EAGER_COUNT = 12;

type Props = {
  /** Scroll distance the pinned sequence occupies, in viewport heights. */
  scrollVh?: number;
  children?: React.ReactNode;
};

export function HeroSequence({ scrollVh = 320, children }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduced, setReduced] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  // Resolve the motion preference on the client only. `null` means "not yet
  // known" so the first paint never commits to the wrong branch.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced !== false) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Coarse pointer or a narrow viewport gets the light tier. Decided once on
    // mount; a resize across the boundary is handled by a full re-init below.
    const isMobile =
      window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const tier: "d" | "m" = isMobile ? "m" : "d";
    const count = isMobile ? MOBILE_FRAMES : DESKTOP_FRAMES;

    const images: (HTMLImageElement | undefined)[] = new Array(count);
    let disposed = false;
    let rafId = 0;
    let drawnFrame = -1;
    let targetFrame = 0;
    let ctxGsap: { revert: () => void } | undefined;
    let scrollTriggerRef: { refresh: () => void } | undefined;
    let sizedFor = "";

    /** Decode a frame; `decode()` keeps the main thread free of jank. */
    const load = (i: number): Promise<void> => {
      if (images[i] || disposed) return Promise.resolve();
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = framePath(tier, i + 1);
        const done = () => {
          if (!disposed) images[i] = img;
          resolve();
        };
        img
          .decode()
          .then(done)
          .catch(() => {
            // Safari rejects decode() for images already in the memory cache.
            img.onload = done;
            img.onerror = () => resolve();
          });
      });
    };

    /**
     * Size the backing store to the device pixel ratio, capped to protect memory.
     *
     * Measured from the viewport rather than the section: while ScrollTrigger
     * pins the hero it lives inside a pin-spacer whose width is frozen at the
     * pinned value, so `section.clientWidth` would report a stale size after a
     * resize. The hero is full-bleed 100svh by design, so the viewport is the
     * correct source of truth.
     */
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 2.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      sizedFor = `${w}x${h}x${dpr}`;
      drawnFrame = -1; // force a repaint at the new size
    };

    /** Draw frame `i` with cover semantics — fill the viewport, never stretch. */
    const draw = (i: number) => {
      const img = images[i];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      drawnFrame = i;
    };

    /** One rAF loop. Redraws only when the target frame actually changed. */
    const tick = () => {
      rafId = requestAnimationFrame(tick);

      // Self-healing sizing. Deriving the canvas size here rather than trusting
      // a resize listener means the sequence stays correct through orientation
      // changes, DPR changes, mobile browser chrome collapsing, and while
      // ScrollTrigger has the section pinned inside a fixed-width pin-spacer.
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 2.5);
      const want = `${window.innerWidth}x${window.innerHeight}x${dpr}`;
      if (want !== sizedFor) {
        resizeCanvas();
        scrollTriggerRef?.refresh();
      }

      if (targetFrame === drawnFrame) return;
      if (images[targetFrame]) {
        draw(targetFrame);
      } else {
        // Not decoded yet: hold the nearest earlier frame rather than blanking,
        // and pull the missing one forward.
        void load(targetFrame);
        for (let k = targetFrame; k >= 0; k--) {
          if (images[k]) {
            if (k !== drawnFrame) draw(k);
            break;
          }
        }
      }
    };

    let cancelled = false;

    (async () => {
      resizeCanvas();

      // Eager head of the sequence, so the first paint is never empty.
      await Promise.all(
        Array.from({ length: Math.min(EAGER_COUNT, count) }, (_, i) => load(i)),
      );
      if (cancelled || disposed) return;
      draw(0);
      setReady(true);

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerRef = ScrollTrigger;

      ctxGsap = gsap.context(() => {
        const state = { p: 0 };
        gsap.to(state, {
          p: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${scrollVh}%`,
            pin: true,
            pinSpacing: true,
            scrub: 0.35, // a touch of inertia; still lands exactly on stop
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // progress 0 → frame 1, progress 1 → frame `count`
              targetFrame = Math.min(
                count - 1,
                Math.max(0, Math.round(self.progress * (count - 1))),
              );
            },
          },
        });
      }, section);

      rafId = requestAnimationFrame(tick);

      // Remaining frames, sequentially and after the critical head, so they
      // never contend with the first paint.
      for (let i = EAGER_COUNT; i < count; i++) {
        if (cancelled || disposed) return;
        await load(i);
      }
      ScrollTrigger.refresh();
    })();

    // A resize changes both the canvas backing store and the pin distance.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (disposed) return;
        resizeCanvas();
        const f = drawnFrame < 0 ? targetFrame : drawnFrame;
        if (images[f]) draw(f);
        // The pin distance and trigger bounds are viewport-relative, so they
        // must recompute too — otherwise the sequence finishes early or late
        // after a resize or an orientation change.
        scrollTriggerRef?.refresh();
      }, 120);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    // Dragging the window to a display with a different pixel density fires no
    // resize event, so watch the DPR directly and repaint when it changes.
    let dprQuery: MediaQueryList | undefined;
    const watchDpr = () => {
      dprQuery?.removeEventListener("change", onDprChange);
      dprQuery = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`,
      );
      dprQuery.addEventListener("change", onDprChange);
    };
    const onDprChange = () => {
      onResize();
      watchDpr();
    };
    watchDpr();

    return () => {
      cancelled = true;
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      dprQuery?.removeEventListener("change", onDprChange);
      ctxGsap?.revert();
      images.length = 0;
    };
  }, [reduced, scrollVh]);

  // ---- Reduced motion: one static frame, no pin, no sequence fetched ----
  if (reduced) {
    return (
      <section
        ref={sectionRef}
        className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={framePath("d", POSTER_INDEX)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <HeroScrim />
        {children}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-[100svh] flex-col justify-end overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 600ms ease" }}
      />
      {/* Painted behind the canvas so there is never a white flash before the
          first decode, and no layout shift — the canvas is absolutely placed. */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-ink-0" />
      <HeroScrim />
      {children}
    </section>
  );
}

/**
 * Legibility treatment. The sequence travels from a dark subject to a bright
 * alpine vista, so the copy needs protection that holds at BOTH ends rather
 * than being tuned to a single frame.
 */
function HeroScrim() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10"
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 42%, rgba(0,0,0,0.20) 100%), linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0.05) 100%)",
      }}
    />
  );
}
