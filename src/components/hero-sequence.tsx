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
 *   desktop  169 frames @ 1920x1080 WebP q93  ~25 MB — every source frame at
 *            native resolution, no downscale, no filtering of any kind
 *   mobile    85 frames @ 1280x720  WebP q84  ~4 MB (every 2nd frame)
 *
 * The desktop tier was previously 1440w, which measured SSIM 0.88 against the
 * source on the opening frames. At native resolution it measures 0.977–0.989.
 * That payload is deliberate: the hero is the first thing a prospect sees, and
 * it loads progressively — twelve frames before the sequence starts, the rest
 * sequentially behind them — so nothing waits on the full download.
 *
 * ACCESSIBILITY
 * Under `prefers-reduced-motion` the sequence never mounts. A single static
 * frame renders instead, the section does not pin, and no frames are fetched.
 * Content is never gated behind the animation.
 */

/**
 * Full-bleed band, edge to edge. The inset rounded panel trialled on the
 * client's reference was reverted at his request — the shape did not earn its
 * keep on a black ground, where a panel can only read by its edge.
 */
const BAND =
  "relative isolate flex flex-col justify-end overflow-hidden";

/**
 * DELIVERY TIERS
 *
 * 169 is every frame of the 24fps, 7.041667s source — nothing interpolated,
 * duplicated or dropped. The mobile tiers take every second frame.
 *
 * There are two mobile tiers because a phone is usually held the wrong way up
 * for this footage, and `cover` is unforgiving about it. On a 390x844 phone at
 * DPR 3 the viewport is 1170x2532 device pixels: covering that with a
 * landscape 1280x720 frame means scaling it 3.5x AND throwing away everything
 * but a 333px-wide strip of it. Three quarters of every byte downloaded is
 * cropped off before it reaches the screen, and the quarter that survives is
 * badly stretched.
 *
 * The portrait tier is that strip, pre-cut at the source's own resolution:
 * a centred 720x1080 crop. Centred because the browser's `cover` already
 * centres, so the framing is identical to what a phone shows today — this
 * changes the resolution, not the composition. It lands at a 2.34x upscale,
 * which is the same figure the full 1920x1080 desktop sequence would achieve
 * on that phone, because the source is only 1080 tall and portrait `cover` is
 * height-limited. In other words it is the best that exists, at 4.2 MB instead
 * of 25 MB.
 *
 * Only one tier is ever fetched. Rotating the device re-initialises.
 */
const TIERS = {
  /** Desktop: every frame, native resolution. */
  d: { frames: 169, width: 1920, height: 1080 },
  /** Phone or tablet held landscape. */
  m: { frames: 85, width: 1280, height: 720 },
  /** Phone or tablet held portrait — pre-cropped to what `cover` leaves. */
  p: { frames: 85, width: 720, height: 1080 },
} as const;

type TierName = keyof typeof TIERS;

/**
 * Frame shown when motion is reduced — the goggle close-up, the strongest
 * single still. Per tier, because the mobile sets are every second frame, so
 * desktop 96 is mobile 48; asking for m/096 would land two thirds of the way
 * through a sequence that only has 85.
 */
const STILL_INDEX = { d: 96, m: 48, p: 48 };

/**
 * Dedicated poster encodes of the opening frame, one per tier.
 *
 * The poster is on screen for well under a second before the canvas draws the
 * full-quality frame over it, so it does not need the sequence's q84-q93 — but
 * it IS what remains if the sequence never starts, so it cannot be ugly
 * either. Encoded at q58-q62, checked by eye for banding in the sky gradient,
 * which is where WebP artefacts show on this footage first.
 *
 * portrait  70.6 KB -> 27.8 KB    landscape 57.4 KB -> 27.6 KB
 * desktop  239.3 KB -> 54.9 KB
 *
 * Regenerate from `<tier>/001.webp` if the sequence is ever re-encoded.
 */
const posterPath = (tier: TierName) => `/hero-frames/${tier}/poster.webp`;

const framePath = (tier: TierName, i: number) =>
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
  const [portrait, setPortrait] = useState<boolean | null>(null);
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

  // Orientation selects between the two mobile tiers, so a change has to tear
  // the sequence down and rebuild it against the other set of frames.
  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const apply = () => setPortrait(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced !== false || portrait === null) return;

    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Coarse pointer or a narrow viewport gets a light tier; which of the two
    // depends on how the device is being held.
    const isMobile =
      window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    // Touch devices are the ones whose viewport height changes on its own, as
    // the URL bar collapses during a scroll. See `onResize` below.
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const tier: TierName = isMobile ? (portrait ? "p" : "m") : "d";
    const {
      frames: count,
      width: sourceWidth,
      height: sourceHeight,
    } = TIERS[tier];

    /**
     * Backing-store scale.
     *
     * Device pixel ratio is the starting point, but it is capped so the canvas
     * never asks for more pixels than the frames actually contain. On a 1440px
     * viewport at DPR 2 the naive figure is a 2880px-wide backing store for a
     * 1920px-wide image: that is 1.5x of pure upscale, costing memory and fill
     * rate to invent nothing. Enlarging a frame does not create detail, so the
     * cap takes the resolution the source can genuinely fill.
     *
     * `cover` scaling is what decides the requirement, so both axes are
     * considered — a portrait phone crops the sides off a landscape frame and
     * is limited by height, not width.
     *
     * Never below 1, or the canvas would be softer than a plain <img>.
     */
    const backingScale = (cssW: number, cssH: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 2 : 2.5);
      const cover = Math.max(cssW / sourceWidth, cssH / sourceHeight);
      const noUpscale = cover > 0 ? 1 / cover : dpr;
      return Math.max(1, Math.min(dpr, noUpscale));
    };

    const images: (HTMLImageElement | undefined)[] = new Array(count);
    let disposed = false;
    let rafId = 0;
    let drawnFrame = -1;
    let targetFrame = 0;
    let ctxGsap: { revert: () => void } | undefined;
    let scrollTriggerRef: { refresh: () => void } | undefined;
    let tailTimer: ReturnType<typeof setTimeout> | undefined;
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
     * Measured from the canvas's own box rather than the viewport. The hero is
     * an inset rounded panel, so it is narrower and shorter than the window;
     * sizing to `innerWidth`/`innerHeight` would give the backing store a
     * different aspect ratio to the element and CSS would stretch the frame.
     *
     * The viewport is still what the tick loop watches for *change*, because
     * while ScrollTrigger has the hero pinned the element sits in a pin-spacer
     * whose box can lag a resize by a frame — so a viewport change is the
     * signal, and the element's own rect is the measurement.
     */
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width) || window.innerWidth;
      const h = Math.round(rect.height) || window.innerHeight;
      const scale = backingScale(w, h);
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      sizedFor = `${window.innerWidth}x${window.innerHeight}x${scale}x${w}x${h}`;
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
      const rect = canvas.getBoundingClientRect();
      const rw = Math.round(rect.width);
      const rh = Math.round(rect.height);
      const want = `${window.innerWidth}x${window.innerHeight}x${backingScale(rw, rh)}x${rw}x${rh}`;
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

      /*
       * Paint on the FIRST frame, not on the twelfth.
       *
       * This used to `await Promise.all` the whole eager head before drawing
       * anything, which on a phone meant ~800 KB had to arrive before the
       * hero showed a pixel. Measured on PageSpeed Insights (Slow 4G, Moto G):
       * LCP 5.5s, and "avoid enormous network payloads — 5,033 KiB".
       * Reproduced locally at 412x823 with the same throttling: the sequence
       * WebPs landed between 5.0s and 7.0s.
       *
       * One frame is enough to fill the band — the other eleven exist so the
       * scrub does not stutter the moment someone starts scrolling, which is
       * a different problem with a different deadline. So frame one is
       * awaited and drawn, and the rest of the head loads behind it.
       */
      await load(0);
      if (cancelled || disposed) return;
      draw(0);
      setReady(true);

      // The remainder of the eager head, now that something is on screen.
      void Promise.all(
        Array.from({ length: Math.min(EAGER_COUNT, count) - 1 }, (_, i) =>
          load(i + 1),
        ),
      );

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      // GSAP's own guard against the collapsing-URL-bar resize storm. Without
      // it ScrollTrigger refreshes itself on those events, independently of
      // the handler below, and the pinned hero jumps under the thumb.
      ScrollTrigger.config({ ignoreMobileResize: true });
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

      /*
       * The tail of the sequence — everything past the eager head — waits for
       * the page to finish loading and for the main thread to go idle.
       *
       * It used to start the moment the head was in, which put ~4 MB on a
       * phone inside the load window, competing with the poster and with
       * every image below the fold. That is the "avoid enormous network
       * payloads — 5,033 KiB" PageSpeed keeps reporting, and it is why mobile
       * LCP sat at 3.0s against a 2.5s threshold.
       *
       * Nothing is dropped and nothing is re-encoded: the same 85 or 169
       * frames still arrive, just after the page has painted. Scrolling
       * sooner is safe — `tick` pulls a missing frame forward on demand and
       * holds the nearest earlier one meanwhile, and the head covers the
       * opening of the scrub either way.
       */
      const loadTail = async () => {
        for (let i = EAGER_COUNT; i < count; i++) {
          if (cancelled || disposed) return;
          await load(i);
        }
        if (!cancelled && !disposed) ScrollTrigger.refresh();
      };

      const startTail = () => {
        if (cancelled || disposed) return;
        // requestIdleCallback is not in Safari; the timeout is the fallback
        // and also the upper bound when the thread never goes properly idle.
        const idle = window.requestIdleCallback;
        if (idle) idle(() => void loadTail(), { timeout: 2000 });
        else tailTimer = setTimeout(() => void loadTail(), 200);
      };

      if (document.readyState === "complete") startTail();
      else window.addEventListener("load", startTail, { once: true });
    })();

    // A resize changes both the canvas backing store and the pin distance.
    /*
     * The mobile scroll glitch.
     *
     * On a phone, scrolling collapses and re-expands the browser's own URL
     * bar. That fires `resize` — mid-scroll, repeatedly, with the width
     * unchanged — and each one used to reach `ScrollTrigger.refresh()`, which
     * recomputes the pin distance and the trigger bounds under the reader's
     * thumb. The section jumps. It is worst on the hero because that is the
     * only pinned section on the page.
     *
     * So a height-only change is ignored. Width is what actually invalidates
     * the layout; the address bar never changes it. Orientation is handled by
     * its own listener, which does need the full rebuild, and desktop keeps
     * the old behaviour because a real window resize there is deliberate and
     * usually changes the width anyway.
     *
     * `ignoreMobileResize` below is GSAP's own guard for the same thing and
     * covers refreshes this handler does not own.
     */
    let lastWidth = window.innerWidth;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = (event?: Event) => {
      const widthChanged = window.innerWidth !== lastWidth;
      const isOrientation = event?.type === "orientationchange";
      if (!widthChanged && !isOrientation && coarsePointer) return;

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (disposed) return;
        lastWidth = window.innerWidth;
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
      clearTimeout(tailTimer);
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      dprQuery?.removeEventListener("change", onDprChange);
      ctxGsap?.revert();
      images.length = 0;
    };
  }, [reduced, portrait, scrollVh]);

  // ---- Reduced motion: one static frame, no pin, no sequence fetched ----
  if (reduced) {
    return (
      <section
        ref={sectionRef}
        className={`${BAND} min-h-[100svh]`}
        aria-labelledby="hero-heading"
      >
        {/* Was always the 1920x1080 desktop frame, so a phone with reduced
            motion downloaded 132 KB for a still it renders at a third of the
            size. Tier-aware now, like the sequence itself. */}
        <HeroPoster index={STILL_INDEX} />
        <HeroScrim />
        {children}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={`${BAND} h-[100svh]`}
      aria-labelledby="hero-heading"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 600ms ease" }}
      />
      {/* The first frame, in the HTML, so the hero has a painted LCP candidate
          that owes nothing to hydration. Also serves the old job of this
          slot — no white flash before the first decode — and there is no
          layout shift either way, since the canvas is absolutely placed. */}
      <HeroPoster index={null} />
      <HeroScrim />
      {children}
    </section>
  );
}

/**
 * HERO POSTER
 *
 * A real <img> in the server-rendered HTML, and the reason mobile LCP is no
 * longer waiting on JavaScript.
 *
 * The canvas cannot be an LCP candidate until React has hydrated, the effect
 * has run, the tier has been chosen and a frame has decoded. On a phone that
 * chain measured 5.5s. This element is discoverable by the preload scanner
 * while the HTML is still being parsed, so the browser starts fetching it
 * before any script executes. Deliberately WITHOUT a priority hint — see the
 * note on the <img> itself; forcing it high measured worse on mobile.
 *
 * <picture> rather than a single src, because the three tiers are very
 * differently sized and a phone must not pull the 1920x1080 desktop frame for
 * a poster. The media queries mirror the tier selection in the effect above —
 * keep them in step; if they diverge, a device downloads one frame here and a
 * different set afterwards, which is worse than either alone.
 *
 * It sits behind the canvas and is never removed. The canvas fades in over it
 * showing the same frame, so there is nothing to cross-fade and nothing to
 * clean up, and if the sequence never starts at all the hero still has its
 * picture.
 */
function HeroPoster({
  /**
   * A specific frame per tier, or `null` for the lightweight opening-frame
   * poster. The reduced-motion branch names a frame because it is showing a
   * chosen still and nothing will replace it; the sequence branch takes the
   * poster, because the canvas covers it within the second.
   */
  index,
}: {
  index: { d: number; m: number; p: number } | null;
}) {
  return (
    <picture>
      <source
        media="(max-width: 767px) and (orientation: portrait), (pointer: coarse) and (orientation: portrait)"
        srcSet={index ? framePath("p", index.p) : posterPath("p")}
      />
      <source
        media="(max-width: 767px), (pointer: coarse)"
        srcSet={index ? framePath("m", index.m) : posterPath("m")}
      />
      {/*
        NOT fetchPriority="high", and the reason is measured.

        With it, desktop went 95 -> 99 (LCP 0.6 -> 0.8s, Speed Index 2.1 ->
        0.9s) but mobile went 78 -> 71: FCP 1.1 -> 2.3s and LCP 5.5 -> 6.8s.
        On a 1.6 Mbps link a 71 KB poster promoted above the stylesheet and
        the font costs more in delayed first paint than it wins in early
        pixels, and LCP can never precede FCP, so both moved together.

        The win here was never the priority hint — it is that the element
        exists in the HTML at all, so the preload scanner finds it while the
        document parses instead of waiting for React to hydrate and choose a
        tier. Chrome still promotes an in-viewport image once layout runs.
        Desktop keeps most of its gain because bandwidth there is not the
        constraint.

        The file is the same one the canvas draws as frame 1, so this costs
        no extra bytes on any tier — it is one download serving both.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={index ? framePath("d", index.d) : posterPath("d")}
        alt=""
        aria-hidden="true"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
    </picture>
  );
}

/**
 * Legibility treatment, deliberately minimal — and different per breakpoint,
 * because the copy occupies a very different share of the frame.
 *
 * The earlier version laid a 0.92 black over the foot of the frame, a 0.55
 * mid-stop and a second left-to-right wash on top of that. It protected the
 * copy but it also flattened the footage — the grade, the specular highlights
 * on the goggle and the whole right-hand side of the frame were being crushed
 * to near-black, which is what made the hero read darker than the source.
 *
 * On desktop the copy sits in the bottom quarter, so a short gradient that has
 * resolved to nothing by the middle of the frame is enough, and the grade
 * survives intact. On a phone the same block of text is three lines longer and
 * reaches well past halfway up a much narrower frame, so the identical
 * gradient left it sitting on a bright helmet and mountain. Mobile therefore
 * gets a taller, heavier ramp. One shared value would have to serve the worse
 * case, which would mean giving back the grade on desktop for nothing.
 *
 * The horizontal wash is gone at both sizes.
 */
function HeroScrim() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 sm:hidden"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.66) 26%, rgba(0,0,0,0.34) 48%, rgba(0,0,0,0.10) 66%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 hidden sm:block"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.34) 18%, rgba(0,0,0,0.08) 38%, rgba(0,0,0,0) 55%)",
        }}
      />
    </>
  );
}
