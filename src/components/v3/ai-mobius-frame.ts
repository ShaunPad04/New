/**
 * Where the Möbius still sits in its render: the trimmed crop of a 2000px
 * square frame, and the margin the live canvas adds round it for the parts
 * of the strip that swing outside the still's box as it turns. Shared by the
 * scene (`ai-mobius-scene.ts`) and the card (`mobius-spin.tsx`) in its own
 * file, so the card can read it without pulling three.js into the page.
 */
export const FRAME = { full: 2000, x: 155, y: 466, w: 1813, h: 1055, pad: 300 };
