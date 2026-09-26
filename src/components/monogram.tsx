/**
 * The BL monogram, flat, in the silver foil gradient — the favicon's traced
 * geometry (src/app/icon.svg) without its tile. For small placements (the
 * header, the footer) where the 3D chrome would be wasted.
 */
export function Monogram({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="240 250 640 700" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.22" stopColor="#b8b8b8" />
          <stop offset="0.44" stopColor="#ffffff" />
          <stop offset="0.62" stopColor="#d4d4d4" />
          <stop offset="0.82" stopColor="#f2f2f2" />
          <stop offset="1" stopColor="#a8a8a8" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${id})`} strokeWidth="56">
        <path d="M447 875V328H612A106 106 0 0 1 612 540H700A132 132 0 0 1 700 804H590" />
        <path d="M528 395V897H860" />
      </g>
    </svg>
  );
}
