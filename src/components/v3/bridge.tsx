/**
 * A soft hand-over between a dark section and a light band (Brad,
 * 2026-10-02: "i dont like the fact it goes from grey and white ish to just
 * black"). A static eased gradient, mixed in oklab so the greys step evenly
 * and the grain hides any banding. It costs nothing at runtime: a live
 * whole-page colour fade was built first and measured at ~7fps on a 4x
 * slowed CPU (every element restyled every frame), so it was dropped.
 * `from` and `to` must be the exact colours of the sections either side.
 */
const STOPS: [number, number][] = [
  [0, 0], [14, 4], [27, 13], [40, 28], [52, 47], [63, 64], [74, 79], [85, 91], [100, 100],
];

export function Bridge({ from, to }: { from: string; to: string }) {
  const stops = STOPS.map(([at, mix]) => `color-mix(in oklab, ${from}, ${to} ${mix}%) ${at}%`).join(", ");
  return (
    <div
      aria-hidden="true"
      className="h-[clamp(160px,28vh,300px)]"
      style={{ background: `linear-gradient(to bottom, ${stops})` }}
    />
  );
}
