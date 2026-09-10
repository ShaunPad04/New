"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { APPEAR_EASE } from "./appear";

type Props = { images: { src: string; alt: string }[] };

/** Property photo gallery: large stage, thumbnail rail, arrow keys. */
export function Gallery({ images }: Props) {
  const [i, setI] = useState(0);
  const n = images.length;
  const go = useCallback((d: number) => setI((c) => (c + d + n) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (n === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative aspect-[3/2] overflow-clip rounded-lg bg-ink-50">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={images[i].src}
            src={images[i].src}
            alt={images[i].alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: APPEAR_EASE }}
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
          <span className="caption2 rounded-[4px] bg-ink-900/80 px-2 py-1 !text-ink-50">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="flex h-7 w-8 items-center justify-center rounded-[4px] bg-ink-50 text-ink-900"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="flex h-7 w-8 items-center justify-center rounded-[4px] bg-ink-50 text-ink-900"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {images.map((img, k) => (
          <button
            key={img.src}
            type="button"
            aria-label={`Photo ${k + 1}`}
            aria-current={k === i}
            onClick={() => setI(k)}
            className={`relative h-[64px] w-[96px] shrink-0 overflow-clip rounded-[6px] transition-opacity duration-300 ${k === i ? "opacity-100 ring-2 ring-ink-900" : "opacity-60 hover:opacity-100"}`}
          >
            <img src={img.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
