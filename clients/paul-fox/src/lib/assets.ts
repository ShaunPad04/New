/**
 * Every image and video on the page.
 *
 * All media belongs to Paul Fox Estate Agents and is served from
 * paul-fox.com. The site references those files directly by default; run
 * `npm run mirror-assets` to copy them into `public/assets/` and set
 * `NEXT_PUBLIC_ASSET_BASE=/assets/` to serve them from this deployment
 * instead. Keys are the local file names used by the mirror script.
 */
const REMOTE = "https://www.paul-fox.com/wp-content/";
const UPLOADS = `${REMOTE}uploads/`;
const THEME = `${REMOTE}themes/paulfoxestateagents/img/`;

/**
 * Media supplied directly by the client and committed to public/assets/.
 * These never come from paul-fox.com. The hero film is Brad's upload,
 * transcoded to 1920×958 H.264 (1.4MB, no audio) with a JPEG poster.
 */
export const LOCAL_ASSETS = {
  "hero.mp4": "/assets/hero.mp4",
  "hero-poster.jpg": "/assets/hero-poster.jpg",
} as const;

export const REMOTE_ASSETS = {
  "logo.png": `${THEME}paulfox-logo.png`,
  "badge.png": `${THEME}paulfox-badge.png`,
  "guild-logo.png": `${THEME}guild-logo.png`,
  "property-ombudsman.png": `${THEME}property-ombudsman.png`,
  "about.jpg": `${UPLOADS}2022/04/Paul-liam-Ryan-1.jpg`,
  "service-buying.jpg": `${UPLOADS}2025/08/PFB250140_34.jpg`,
  "service-selling.jpg": `${UPLOADS}2026/03/PFA230788_16.jpg`,
  "service-lettings.jpg": `${UPLOADS}2017/09/MBP_0020web.jpg`,
  "service-surveys.jpg": `${UPLOADS}2026/03/PFE250159_29.jpg`,
  "listing-sand-pit-lane.jpg": `${UPLOADS}2026/03/PFA230788_07-scaled.jpg`,
  "listing-godnow-bridge.jpg": `${UPLOADS}2026/03/PFE250159_55.jpg`,
  "listing-hayfield-grove.jpg": `${UPLOADS}2026/07/AF-Plot-3.jpg`,
  "listing-allisons-cottage.jpg": `${UPLOADS}2025/08/ai-enhanced-6a02fc84d6ca9.jpg`,
  "review-1a.jpg": `${UPLOADS}2026/03/PFA230788_10.jpg`,
  "review-1b.jpg": `${UPLOADS}2026/03/PFA230788_30.jpg`,
  "review-1c.jpg": `${UPLOADS}2026/03/PFE250159_51.jpg`,
  "review-2a.jpg": `${UPLOADS}2025/08/PFB250140_41.jpg`,
  "review-2b.jpg": `${UPLOADS}2026/07/Kitchennew-1.jpg`,
  "review-2c.jpg": `${UPLOADS}2026/07/Livingnew-1.jpg`,
  "review-3a.jpg": `${UPLOADS}2026/05/RearAspect.jpg`,
  "review-3b.jpg": `${UPLOADS}2024/08/PFL240078_10.jpg`,
  "review-3c.jpg": `${UPLOADS}2024/08/PFL240078_11.jpg`,
  "features-bg.jpg": `${UPLOADS}2026/03/PFA230788_07-scaled.jpg`,
  "team-bg.jpg": `${UPLOADS}2026/03/PFE250159_55.jpg`,
  "team-paul.jpg": `${UPLOADS}2017/08/Paul-1024x757.jpg`,
  "team-ryan.jpg": `${UPLOADS}2017/08/Ryan-959x1024.jpg`,
  "team-liam.jpg": `${UPLOADS}2017/08/Liam-1024x768.jpg`,
  "team-hannah.jpg": `${UPLOADS}2017/08/Hannah-1024x768.jpg`,
  "team-richard.jpg": `${UPLOADS}2017/08/Richard-930x1024.jpg`,
  "team-ben.jpg": `${UPLOADS}2017/08/Ben-1024x826.jpg`,
  "team-becci.jpg": `${UPLOADS}2017/08/Becci-886x1024.jpg`,
  "team-michelle.jpg": `${UPLOADS}2017/08/Michelle-2025-768x1024.jpg`,
  "team-jackie.jpg": `${UPLOADS}2017/11/Jackie-892x1024.jpg`,
  "team-meg.jpg": `${UPLOADS}2022/05/Megan-768x1024.jpg`,
  "faq.jpg": `${UPLOADS}2017/10/finest-header-2.jpg`,
  "contact-bg.jpg": `${UPLOADS}2026/05/AerialRear.png`,
} as const;

export type AssetKey = keyof typeof REMOTE_ASSETS | keyof typeof LOCAL_ASSETS;

const LOCAL_BASE = process.env.NEXT_PUBLIC_ASSET_BASE?.replace(/\/?$/, "/");

/** Resolve an asset key to the URL the page should load. */
export function asset(key: AssetKey): string {
  if (key in LOCAL_ASSETS) return LOCAL_ASSETS[key as keyof typeof LOCAL_ASSETS];
  if (LOCAL_BASE) return `${LOCAL_BASE}${key}`;
  return REMOTE_ASSETS[key as keyof typeof REMOTE_ASSETS];
}

/**
 * Resolve a path relative to the WordPress uploads folder — the form the
 * property, staff, office and blog data files use (e.g. "2017/08/Paul.jpg").
 * With NEXT_PUBLIC_ASSET_BASE set these are read from `<base>/uploads/`.
 */
export function upload(path: string): string {
  if (LOCAL_BASE) return `${LOCAL_BASE}uploads/${path}`;
  return `${UPLOADS}${path}`;
}
