"use client";

import { useEffect, useRef } from "react";

/**
 * WORK CARD VIDEO PREVIEW (redesign, 2026-09-11)
 *
 * A muted, looping preview that sits over the card's still image and plays
 * on hover on a fine-pointer device, or while in view on a coarse-pointer
 * one. `preload="none"` — nothing downloads until the first play, and the
 * still underneath is the poster, so a card with a video costs no extra
 * bytes for anyone who never hovers it.
 *
 * Under `prefers-reduced-motion` it never plays and never fetches: the still
 * simply remains. Sources are resolved from disk at build time
 * (`resolveWorkVideo`), so this component only mounts when a file exists at
 * `public/videos/work/<id>.{webm,mp4}`.
 */
export function WorkVideo({ sources }: { sources: string[] }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const play = () => {
      video.style.opacity = "1";
      void video.play().catch(() => {});
    };
    const stop = () => {
      video.style.opacity = "0";
      video.pause();
    };

    if (window.matchMedia("(pointer: fine)").matches) {
      // The card shell is the hover surface, not the video itself — the
      // preview should start wherever on the card the cursor lands.
      const card = video.closest(".group") ?? video;
      card.addEventListener("pointerenter", play);
      card.addEventListener("pointerleave", stop);
      return () => {
        card.removeEventListener("pointerenter", play);
        card.removeEventListener("pointerleave", stop);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : stop()),
      { threshold: 0.5 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500"
    >
      {sources.map((src) => (
        <source
          key={src}
          src={src}
          type={src.endsWith(".webm") ? "video/webm" : "video/mp4"}
        />
      ))}
    </video>
  );
}
