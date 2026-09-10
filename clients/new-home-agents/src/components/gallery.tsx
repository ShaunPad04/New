"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PropertyImage } from "@/lib/properties";
import { cn } from "@/lib/utils";

/**
 * Property gallery — reference "Cover Images": a large 20px-radius image
 * (833×500) beside two stacked 24px-radius images (409×245), 14px gaps.
 * Any image opens an accessible lightbox (dialog, arrow keys, Escape,
 * focus returned to the trigger) with next/previous controls.
 */
export function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const show = useCallback((i: number, trigger?: HTMLElement) => {
    lastTrigger.current = trigger ?? (document.activeElement as HTMLElement);
    setOpen(i);
  }, []);
  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);
  const step = useCallback((d: number) => setOpen((i) => (i == null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close, step]);

  if (!images.length) {
    return <div className="flex aspect-[1256/500] items-center justify-center rounded-[20px] bg-mist text-slate">Photography to follow</div>;
  }
  const [main, ...rest] = images;
  const side = rest.slice(0, 2);

  return (
    <>
      <div className={cn("grid gap-[14px]", side.length ? "md:grid-cols-[2fr_1fr]" : "")}>
        <button type="button" onClick={(e) => show(0, e.currentTarget)} className="group relative block aspect-[833/500] w-full overflow-hidden rounded-[20px] bg-mist">
          <Image src={main.src} alt={main.alt} fill priority sizes="(max-width: 809px) 100vw, 833px" className="object-cover transition-transform duration-[1200ms] ease-out-soft group-hover:scale-[1.03]" />
          <span className="sr-only">Open photo 1 of {images.length}</span>
          {images.length > 3 ? (
            <span aria-hidden="true" className="absolute bottom-5 left-5 rounded-full bg-white px-3 py-1 text-sm text-ink">{images.length} photos</span>
          ) : null}
        </button>
        {side.length ? (
          <div className="grid grid-cols-2 gap-[14px] md:grid-cols-1">
            {side.map((im, i) => (
              <button key={im.src} type="button" onClick={(e) => show(i + 1, e.currentTarget)} className="group relative block aspect-[409/245] w-full overflow-hidden rounded-[24px] bg-mist">
                <Image src={im.src} alt={im.alt} fill sizes="(max-width: 809px) 50vw, 409px" className="object-cover transition-transform duration-[1200ms] ease-out-soft group-hover:scale-[1.03]" />
                <span className="sr-only">Open photo {i + 2} of {images.length}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {images.length > 3 ? (
        <ul className="mt-[14px] grid grid-cols-4 gap-[14px] sm:grid-cols-6 md:grid-cols-8" aria-label="More photos">
          {images.slice(3).map((im, i) => (
            <li key={im.src}>
              <button type="button" onClick={(e) => show(i + 3, e.currentTarget)} className="relative block aspect-[4/3] w-full overflow-hidden rounded-[10px] bg-mist">
                <Image src={im.src} alt={im.alt} fill sizes="160px" className="object-cover" />
                <span className="sr-only">Open photo {i + 4} of {images.length}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open != null ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photo ${open + 1} of ${images.length}`}
          className="fixed inset-0 z-[100] flex flex-col bg-ink/95 text-white"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-sm text-cloud">{open + 1} / {images.length}</p>
            <button type="button" onClick={close} className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20">Close</button>
          </div>
          <div className="relative flex-1">
            <Image key={images[open].src} src={images[open].src} alt={images[open].alt} fill sizes="100vw" className="object-contain" />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <button type="button" onClick={() => step(-1)} className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20">← Previous</button>
            <p className="hidden max-w-[60%] truncate text-sm text-cloud sm:block">{images[open].alt}</p>
            <button type="button" onClick={() => step(1)} className="rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20">Next →</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
