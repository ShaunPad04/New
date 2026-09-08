"use client";

import { useEffect, useRef } from "react";
import { processSteps } from "@/lib/content";

/**
 * PROCESS TRACK — drag it, and the cards turn.
 *
 * Adapted from a reference the client sent, where a row of process cards can
 * be thrown sideways and the cards read as physical objects rather than as
 * columns of a table.
 *
 * WHAT IS BORROWED AND WHAT IS NOT. The gesture and the sense of depth are
 * borrowed. The execution is not: the reference drives everything from a
 * library, and this needs neither. The track is a native scroll container with
 * scroll-snap, so the browser supplies the momentum, the rubber-banding and
 * the keyboard and trackpad behaviour that a hand-rolled drag always gets
 * subtly wrong — the same reasoning already recorded for the pricing carousel.
 * Pointer drag is added ON TOP of that for mouse users, who otherwise have no
 * way to throw a horizontal track at all.
 *
 * THE DEPTH IS REAL, not a hover trick: each card's `rotateY` follows its
 * distance from the centre of the track, so cards turn away at the edges and
 * face you in the middle, and the whole row rotates as you drag. Computed from
 * the TRACK's scroll position, not the window's — this page already spends its
 * scroll budget on the pinned hero, and adding a second window-scroll reader
 * is precisely what the frame-timing work said not to do.
 *
 * Reads are coalesced to one per animation frame and only ever write
 * `transform`, which the compositor handles without layout or paint.
 *
 * ACCESSIBILITY. The track is a real scroll container, so it is reachable and
 * operable by keyboard with no extra code, and every card stays in the DOM in
 * reading order — nothing here is behind a gesture. `prefers-reduced-motion`
 * removes the rotation entirely and leaves a plain, snapping list.
 */

/** How far a card turns at the edge of the track, in degrees. */
const MAX_TURN = 7;

export function ProcessTrack() {
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const paint = () => {
      frame = 0;
      const mid = track.scrollLeft + track.clientWidth / 2;

      for (const card of Array.from(track.children) as HTMLElement[]) {
        if (reduced.matches) {
          card.style.transform = "";
          continue;
        }
        const centre = card.offsetLeft + card.offsetWidth / 2;
        // -1 at the far left of the visible track, +1 at the far right.
        const offset = Math.max(
          -1,
          Math.min(1, (centre - mid) / (track.clientWidth / 2)),
        );
        card.style.transform = `perspective(1200px) rotateY(${(-offset * MAX_TURN).toFixed(2)}deg) scale(${(1 - Math.abs(offset) * 0.04).toFixed(3)})`;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(paint);
    };

    paint();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    reduced.addEventListener("change", paint);

    /*
     * Pointer drag, for mice.
     *
     * Touch is left entirely to the browser: it already throws this track
     * properly, and intercepting it would replace good native momentum with a
     * worse hand-written version. `pointerType === "mouse"` is the whole
     * guard.
     */
    let startX = 0;
    let startScroll = 0;
    let dragging = false;

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
      track.style.cursor = "grabbing";
      track.style.scrollSnapType = "none";
    };

    const move = (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      track.scrollLeft = startScroll - (e.clientX - startX);
    };

    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      track.releasePointerCapture?.(e.pointerId);
      track.style.cursor = "";
      // Snapping is restored AFTER the release so the card settles rather than
      // fighting the drag on every pixel of it.
      track.style.scrollSnapType = "";
    };

    track.addEventListener("pointerdown", down);
    track.addEventListener("pointermove", move);
    track.addEventListener("pointerup", up);
    track.addEventListener("pointercancel", up);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", paint);
      track.removeEventListener("pointerdown", down);
      track.removeEventListener("pointermove", move);
      track.removeEventListener("pointerup", up);
      track.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <ol
      ref={trackRef}
      /* Bleeds to the edges so a card sits flush with the copy above while the
         next runs off the screen — the overhang is the affordance, the same
         one the pricing carousel uses, so there is no "drag me" instruction to
         write. */
      className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scroll-padding-left:1.5rem] sm:-mx-10 sm:px-10 sm:[scroll-padding-left:2.5rem] lg:-mx-16 lg:px-16 lg:[scroll-padding-left:4rem]"
    >
      {processSteps.map((step) => (
        <li
          key={step.index}
          /* 29% at `lg`, not 25%: four cards at a clean quarter fit the track
             exactly, the container never overflows, and a drag that cannot
             scroll is a gesture that silently does nothing. At 29% the fourth
             card runs off the edge, which both restores the drag and supplies
             the affordance — the overhang is the instruction. */
          className="w-[78%] shrink-0 snap-start transition-transform duration-200 ease-out will-change-transform sm:w-[46%] lg:w-[29%]"
        >
          <div className="bezel h-full">
            <div className="bezel-core h-full p-7 lg:p-9">
              <span className="display text-5xl text-ink-500">
                {step.index}
              </span>
              <h4 className="display mt-8 text-xl text-ink-1000">
                {step.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-ink-700">
                {step.body}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
