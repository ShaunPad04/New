"use client";

import { useEffect, useRef, useState } from "react";
import type { Reel } from "@/components/ReelPlayer";

/**
 * Socials B (round 4): every reel side by side, like the shop's Instagram grid. On a
 * desktop a reel plays, muted, while the pointer rests on it; on a phone the row scrolls
 * sideways and the reel nearest the middle plays. Tapping or pressing a reel pins it
 * playing (or stops it). Each <video> only gets its file when it first plays.
 */
export default function ReelsWall({ reels }: { reels: Reel[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [centre, setCentre] = useState<number | null>(null);
  const [touch, setTouch] = useState(false);
  const [reduced, setReduced] = useState(false);
  const row = useRef<HTMLUListElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());

  useEffect(() => {
    const t = window.matchMedia("(hover: none)");
    const r = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => { setTouch(t.matches); setReduced(r.matches); };
    on();
    t.addEventListener("change", on);
    r.addEventListener("change", on);
    return () => { t.removeEventListener("change", on); r.removeEventListener("change", on); };
  }, []);

  // Phones: the reel most in view inside the sideways row plays.
  useEffect(() => {
    const el = row.current;
    if (!el || !touch || reduced) return;
    const ratios = new Map<number, number>();
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => ratios.set(Number((e.target as HTMLElement).dataset.i), e.isIntersecting ? e.intersectionRatio : 0));
        let best: number | null = null;
        let max = 0.6;
        ratios.forEach((v, k) => { if (v > max) { max = v; best = k; } });
        setCentre(best);
      },
      { root: el, threshold: [0, 0.6, 0.8, 1] },
    );
    el.querySelectorAll("[data-i]").forEach((li) => io.observe(li));
    // Stop when the row leaves the screen.
    const out = new IntersectionObserver(([e]) => !e.isIntersecting && setCentre(null), { threshold: 0.2 });
    out.observe(el);
    return () => { io.disconnect(); out.disconnect(); };
  }, [touch, reduced]);

  const playing = pinned ?? (touch ? centre : hover);

  useEffect(() => {
    if (playing !== null && !loaded.has(playing)) setLoaded((s) => new Set(s).add(playing));
    vids.current.forEach((v, i) => {
      if (!v) return;
      if (i === playing) v.play().catch(() => {});
      else v.pause();
    });
  }, [playing, loaded]);

  return (
    <ul ref={row} className="rwall" aria-label="Reels">
      {reels.map((r, i) => {
        const on = playing === i;
        return (
          <li key={r.id} data-i={i}>
            <button
              type="button"
              className={`rwall-tile${on ? " is-on" : ""}`}
              aria-pressed={pinned === i}
              aria-label={`${r.title}: ${pinned === i ? "stop" : "play"}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((h) => (h === i ? null : h))}
              onClick={() => setPinned((p) => (p === i ? null : i))}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.poster.replace(/\.jpg$/, ".webp")} alt="" className="rwall-poster" loading="lazy" decoding="async" />
              <video
                ref={(el) => { vids.current[i] = el; }}
                src={loaded.has(i) || on ? r.src : undefined}
                className="rwall-video"
                muted
                playsInline
                loop
                preload="none"
                aria-hidden="true"
              />
              <span className="rwall-cap">
                <span className="rwall-play" aria-hidden="true">
                  {on ? (
                    <svg viewBox="0 0 24 24" width="12" height="12"><path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="12" height="12"><path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" /></svg>
                  )}
                </span>
                <span className="rwall-title">{r.title}</span>
                <span className="rwall-dur tnum">{`${Math.floor(r.duration / 60)}:${String(r.duration % 60).padStart(2, "0")}`}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
