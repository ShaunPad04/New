"use client";

import { useEffect, useRef } from "react";

/**
 * HERO FILM — the particle-vortex loop behind the Neiden hero (Brad,
 * 2026-09-28: "a closer match to Neiden's hero video", and "no, can we
 * create it somewhere else" instead of spending Higgsfield credits). Our own
 * Blender render, not Neiden's file: `scripts/hero-vortex/vortex.py` builds
 * it (a torus of dotted rings, real depth of field, a seamless 10s loop).
 *
 * The poster frame is in the HTML, so the hero is designed before any video
 * byte arrives. The video's sources are attached only once the browser is
 * idle after first paint, it plays muted and inline, pauses off-screen and in
 * a hidden tab, and never loads at all under reduced motion.
 *
 * It also drives the wordmark glitch (it already owns the on-screen state):
 * every 5-9s while visible it sets `data-glitch` on `#${glitchId}` for one
 * 340ms burst. Hover bursts are pure CSS.
 */
/**
 * One in-memory copy per visit, shared by every mount (Brad, 2026-09-28: "it
 * keeps getting rid of the background video"). The first version revoked its
 * blob URL on unmount; any remount (Fast Refresh in dev, a client navigation
 * back to `/`) left the element pointing at a dead URL, the next loop errored
 * and the film went black. The URL is now created once and never revoked
 * while the page lives; it is under 1MB.
 */
const filmCache = new Map<string, Promise<string>>();
function filmUrl(url: string): Promise<string> {
  let p = filmCache.get(url);
  if (!p) {
    // Low priority: the poster is already on screen, and the page's own text
    // and fonts must win the network (Lighthouse charged this 851KB file
    // against first paint when it went out at the default High priority).
    p = fetch(url, { priority: "low" } as RequestInit)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.blob();
      })
      .then((blob) => URL.createObjectURL(blob))
      .catch(() => url); // stream it instead; still plays, just less smoothly
    filmCache.set(url, p);
  }
  return p;
}

export function HeroFilm({ glitchId }: { glitchId?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glitchEl = glitchId ? document.getElementById(glitchId) : null;
    let visible = true;
    let loaded = false;

    const play = () => {
      if (loaded && visible && !document.hidden)
        void video.play().catch(() => {});
    };
    const pause = () => video.pause();

    let glitchTimer = 0;
    const glitch = (delay: number) => {
      if (!glitchEl || reduced) return;
      window.clearTimeout(glitchTimer);
      glitchTimer = window.setTimeout(() => {
        if (visible && !document.hidden) {
          glitchEl.setAttribute("data-glitch", "");
          window.setTimeout(() => glitchEl.removeAttribute("data-glitch"), 340);
        }
        glitch(5000 + Math.random() * 4000);
      }, delay);
    };

    /*
     * Played from memory, not streamed: streamed, every 10s loop went back to
     * the server for the start of the file and could stall. See `filmUrl`.
     */
    let cancelled = false;
    let src = "";
    const attach = async () => {
      const small = window.innerWidth < 768;
      const type = video.canPlayType('video/webm; codecs="vp9"') ? "webm" : "mp4";
      src = await filmUrl(`/videos/hero/vortex${small ? "-sm" : ""}.${type}`);
      if (cancelled) return;
      if (video.getAttribute("src") !== src) video.src = src;
      loaded = true;
      play();
    };
    /*
     * The film is fetched only once the page has loaded AND the load screen has
     * lifted (~2.55s): until then the poster shows and nothing is lost, and
     * the 0.9-1.9MB download no longer competes with first paint (measured
     * 2026-09-29: mobile Lighthouse 81-84 with it early). Phones have no load
     * screen (same breakpoint as the CSS), so there it goes right after load.
     * The glitch timer starts as before.
     */
    let filmTimer = 0;
    const lift = matchMedia("(min-width: 768px)").matches ? 2800 : 0;
    const scheduleFilm = () => {
      filmTimer = window.setTimeout(() => void attach(), Math.max(0, lift - performance.now()));
    };
    const start = () => {
      glitch(1300);
      if (reduced) return;
      if (document.readyState === "complete") scheduleFilm();
      else window.addEventListener("load", scheduleFilm, { once: true });
    };

    // Self-healing. If the element ever errors, re-attach (up to 5 times); and
    // every 2s, if it should be playing but is not (a refused play(), a stall,
    // a dropped frame after the tab was hidden), start it again.
    let retries = 0;
    const heal = () => {
      if (cancelled || reduced || retries > 5) return;
      retries++;
      video.removeAttribute("src");
      video.load();
      void attach();
    };
    const onError = () => heal();
    video.addEventListener("error", onError);
    const watchdog = window.setInterval(() => {
      // Ignore visibility blips: a hidden preview pane can report "visible" for
      // a few ms at a time, and playing into that only fights the browser.
      if (!loaded || !visible || document.hidden || performance.now() - shownAt < 1000) return;
      if (video.error) return heal();
      // Only a genuinely stopped film: never seek, never fight the browser.
      if (video.paused && video.readyState >= 2) play();
      else if (!video.paused) retries = 0;
    }, 2000);

    const hasIdle = "requestIdleCallback" in window;
    const idle = hasIdle
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 400);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(video);
    /*
     * Coming back to the tab. The IntersectionObserver can stay stuck
     * "off-screen" after a tab or the preview pane was hidden, so re-measure
     * the hero directly, then play. NEVER seek here: an earlier version nudged
     * `currentTime` on every focus/visibility change to force a repaint, and
     * each seek made the film stutter — every couple of seconds in the
     * preview pane (Brad, 2026-09-28: "the background keeps glitching").
     */
    let shownAt = performance.now();
    const onVisibility = () => {
      if (document.hidden) return pause();
      shownAt = performance.now();
      const r = video.getBoundingClientRect();
      visible = r.bottom > 0 && r.top < window.innerHeight;
      play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearTimeout(filmTimer);
      window.removeEventListener("load", scheduleFilm);
      window.clearInterval(watchdog);
      video.removeEventListener("error", onError);
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      window.clearTimeout(glitchTimer);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      glitchEl?.removeAttribute("data-glitch");
    };
  }, [glitchId]);

  return (
    <>
      <video
        ref={ref}
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="none"
        // The still is the element's BACKGROUND, not a `poster`: it shows
        // before the film and in any decoder gap (a hidden tab, a resize), so
        // never black. As a background it can follow the breakpoint: phones
        // get the 960px still (29KB), matching the 960px film they play.
        className="absolute inset-0 -z-10 h-full w-full bg-[url(/videos/hero/vortex-poster-sm.webp)] bg-cover bg-center object-cover md:bg-[url(/videos/hero/vortex-poster.webp)]"
      />
      {/* Legibility: the brightest rings pass behind the lede, so the film is
        held down overall and a little more across the lower half. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.25),rgb(0_0_0/0.3)_45%,rgb(0_0_0/0.6))]"
      />
    </>
  );
}
