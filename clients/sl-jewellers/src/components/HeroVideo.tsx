"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero film: the rings clip as a boomerang loop (forward, then back, so the loop
 * has no cut), over the poster still that the server already painted.
 *
 * Mounted after hydration and never under reduced motion or Save-Data, so those
 * visitors keep the still and never download the film. The file is chosen here:
 *   - portrait screens get the 9:16 crop, everything else the 16:9 cut
 *   - AV1 (WebM) wherever the browser decodes it (Chrome, Firefox, Edge, recent
 *     Safari), H.264 (MP4) everywhere else
 *   - the 1440p cut only for AV1 on a wide, dense screen (width x DPR over 2200)
 * The film fades in on its first frame, which is the poster's frame, so nothing swaps.
 * It pauses off screen and in a hidden tab. The loop runs past five seconds beside
 * other content, so it carries a pause button (WCAG 2.2.2).
 */
const BASE = "/videos/hero/rings";

function pick(video: HTMLVideoElement) {
  const portrait = matchMedia("(orientation: portrait)").matches;
  const av1 = video.canPlayType('video/webm; codecs="av01.0.08M.08"') !== "";
  const big = !portrait && av1 && innerWidth * devicePixelRatio > 2200;
  const cut = portrait ? "port-1080" : big ? "land-1440" : "land-1080";
  return `${BASE}-${cut}.${av1 ? "webm" : "mp4"}`;
}

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [on, setOn] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const userPausedRef = useRef(false);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!reduce && !saveData) setEnabled(true);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!enabled || !v) return;

    let inView = true;
    const run = () => {
      if (userPausedRef.current || !inView || document.hidden) v.pause();
      else v.play().catch(() => {
        /* autoplay refused (iOS Low Power Mode): the poster stays */
      });
    };
    const load = () => {
      const src = pick(v);
      if (v.getAttribute("src") === src) return;
      setOn(false);
      v.src = src;
      run();
    };

    const onPlaying = () => setOn(true);
    v.addEventListener("playing", onPlaying);
    const portrait = matchMedia("(orientation: portrait)");
    portrait.addEventListener("change", load);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      run();
    });
    io.observe(v);
    document.addEventListener("visibilitychange", run);
    load();

    return () => {
      v.removeEventListener("playing", onPlaying);
      portrait.removeEventListener("change", load);
      io.disconnect();
      document.removeEventListener("visibilitychange", run);
      v.pause();
    };
  }, [enabled]);

  if (!enabled) return null;

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !userPausedRef.current;
    userPausedRef.current = next;
    setUserPaused(next);
    if (next) v.pause();
    else v.play().catch(() => {});
  };

  return (
    <>
      <video
        ref={ref}
        className={`hero-film${on ? " is-on" : ""}`}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
      <button type="button" className="hero-toggle" onClick={toggle} aria-label={userPaused ? "Play the background video" : "Pause the background video"}>
        {userPaused ? (
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
            <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
            <rect x="6.5" y="5" width="4" height="14" rx="1" />
            <rect x="13.5" y="5" width="4" height="14" rx="1" />
          </svg>
        )}
      </button>
    </>
  );
}
