/**
 * Where the Möbius still sits in its render: the trimmed crop of a 2000px
 * square frame (x, y, w, h). The live canvas renders `view`, the square the
 * strip can reach at ANY orientation (it can be dragged round freely, so
 * this is its bounding sphere in projection, ~1,050px from the centre, plus
 * a margin), and is positioned over the still from the two. Shared by the
 * scene (`ai-mobius-scene.ts`) and the card (`mobius-spin.tsx`) in its own
 * file, so the card can read it without pulling three.js into the page.
 */
export const FRAME = { full: 2000, x: 155, y: 466, w: 1813, h: 1055, view: { x: -80, y: -80, w: 2160, h: 2160 } };
