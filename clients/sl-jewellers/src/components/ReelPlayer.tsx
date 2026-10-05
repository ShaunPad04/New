"use client";

import { useEffect, useRef, useState } from "react";

export type Reel = { id: string; src: string; poster: string; title: string; duration: number; /** true when the file keeps its soundtrack: shows the sound button */ audio?: boolean };

/**
 * One phone-shaped player plus a playlist. Nothing downloads until play is
 * pressed; the active reel plays muted and hands over to the next when it
 * ends. Keyboard: the playlist buttons are real buttons; space/enter toggles.
 */
export default function ReelPlayer({ reels }: { reels: Reel[] }) {
  const video = useRef<HTMLVideoElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  // Every clip starts muted (autoplay rules, and most have no soundtrack). The visitor
  // unmutes a clip that has one; the choice is remembered for the rest of the playlist.
  const [muted, setMuted] = useState(true);
  const current = reels[index];

  useEffect(() => {
    if (video.current) video.current.muted = muted;
  }, [muted, index]);

  const play = async (i = index) => {
    const v = video.current;
    if (!v) return;
    if (i !== index) {
      setIndex(i);
      setProgress(0);
      // let React swap the src, then play
      requestAnimationFrame(() => {
        v.load();
        v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      });
      return;
    }
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && video.current && !video.current.paused) {
        video.current.pause();
        setPlaying(false);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mmss = (s: number) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, "0")}`;

  return (
    <div ref={wrap} className="reelplayer">
      <div className={`phone ${playing ? "is-playing" : ""}`}>
        <video
          ref={video}
          src={current.src}
          poster={current.poster}
          muted={muted}
          playsInline
          preload="none"
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setProgress(v.currentTime / v.duration);
          }}
          onEnded={() => {
            const next = (index + 1) % reels.length;
            play(next);
          }}
          onPause={() => setPlaying(false)}
          aria-label={`Reel: ${current.title}`}
        />
        <button type="button" className="phone-tap" onClick={() => play()} aria-label={playing ? `Pause ${current.title}` : `Play ${current.title}`} aria-pressed={playing}>
          <span className="phone-play" aria-hidden="true">
            {playing ? (
              <svg width="22" height="22" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="2" width="3.5" height="10" /><rect x="8.5" y="2" width="3.5" height="10" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5z" /></svg>
            )}
          </span>
        </button>
        {current.audio && (
          <button
            type="button"
            className="phone-sound"
            onClick={() => setMuted((m) => !m)}
            aria-pressed={!muted}
            aria-label={muted ? `Unmute ${current.title}` : `Mute ${current.title}`}
          >
            {muted ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z" /><path d="m23 9-6 6M17 9l6 6" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" /></svg>
            )}
            <span className="sr-only">{muted ? "Sound off" : "Sound on"}</span>
          </button>
        )}
        <div className="phone-meta" aria-hidden="true">
          <span className="phone-title">{current.title}</span>
          <span className="phone-bar">
            <span style={{ transform: `scaleX(${progress})` }} />
          </span>
        </div>
      </div>

      <ol className="playlist" aria-label="Reels">
        {reels.map((r, i) => (
          <li key={r.id}>
            <button type="button" className={`playlist-item ${i === index ? "is-active" : ""}`} onClick={() => play(i)} aria-current={i === index ? "true" : undefined}>
              <span className="playlist-n tnum">{String(i + 1).padStart(2, "0")}</span>
              <span className="playlist-title">{r.title}</span>
              <span className="playlist-dur tnum">{mmss(r.duration)}</span>
              <span className="playlist-state" aria-hidden="true">{i === index && playing ? "Playing" : i === index ? "Next" : ""}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
