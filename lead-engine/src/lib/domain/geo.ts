import type { DistanceBand } from "./types";

/**
 * Geographic reference points.
 *
 * The anchor is Cleethorpes town centre, not the property itself: BlackLine
 * has not been given Cambridge Mews' exact coordinates, and a made-up grid
 * reference would be a fabricated fact. Town-centre accuracy is more than
 * enough to separate "in the area" from "the other end of the country".
 */
export const ANCHOR = { name: "Cleethorpes", lat: 53.5651, lon: -0.0222 } as const;

/** Places whose coordinates we can state, for banding work locations. */
const PLACES: Record<string, { lat: number; lon: number }> = {
  cleethorpes: { lat: 53.5651, lon: -0.0222 },
  grimsby: { lat: 53.5675, lon: -0.0798 },
  immingham: { lat: 53.6139, lon: -0.2216 },
  "great coates": { lat: 53.5836, lon: -0.1275 },
  stallingborough: { lat: 53.6019, lon: -0.1706 },
  healing: { lat: 53.5828, lon: -0.1051 },
  humberston: { lat: 53.5428, lon: -0.0234 },
  hull: { lat: 53.7457, lon: -0.3367 },
  "kingston upon hull": { lat: 53.7457, lon: -0.3367 },
  barton: { lat: 53.6847, lon: -0.4437 },
  "barton-upon-humber": { lat: 53.6847, lon: -0.4437 },
  scunthorpe: { lat: 53.5809, lon: -0.6502 },
  brigg: { lat: 53.5528, lon: -0.4903 },
  louth: { lat: 53.3667, lon: 0.0056 },
  lincoln: { lat: 53.2307, lon: -0.5406 },
  beverley: { lat: 53.8424, lon: -0.4279 },
  goole: { lat: 53.7051, lon: -0.8735 },
  withernsea: { lat: 53.7302, lon: 0.0333 },
  "north killingholme": { lat: 53.6603, lon: -0.2477 },
  "south killingholme": { lat: 53.6431, lon: -0.2337 },
  "hornsea": { lat: 53.9111, lon: -0.1667 },
  "dogger bank": { lat: 54.75, lon: 2.0 },
  "humber": { lat: 53.6339, lon: -0.2 },
};

const EARTH_RADIUS_KM = 6371;

export function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function bandForDistance(km: number): DistanceBand {
  // 12km straight-line keeps Grimsby, Humberston and Healing in the immediate
  // area while putting Immingham (a real drive away) in the wider Humber band.
  if (km <= 12) return "in_area";
  if (km <= 45) return "humber";
  if (km <= 110) return "wider_region";
  return "outside";
}

/**
 * Resolve a free-text work location to a distance band.
 *
 * Returns "unknown" when the text names no place we hold coordinates for.
 * Guessing here would put points on the board for a location nobody verified.
 */
export function bandForLocation(text: string | undefined): {
  band: DistanceBand;
  matched?: string;
  km?: number;
} {
  if (!text) return { band: "unknown" };
  const haystack = text.toLowerCase();
  let best: { name: string; km: number } | undefined;
  for (const [name, point] of Object.entries(PLACES)) {
    if (!haystack.includes(name)) continue;
    const km = haversineKm(ANCHOR, point);
    // Prefer the most specific (closest-matching, longest) place name.
    if (!best || name.length > best.name.length) best = { name, km };
  }
  if (!best) return { band: "unknown" };
  return { band: bandForDistance(best.km), matched: best.name, km: Math.round(best.km) };
}

export const KNOWN_PLACES = Object.keys(PLACES);
