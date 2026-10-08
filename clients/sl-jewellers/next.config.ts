import path from "node:path";
import type { NextConfig } from "next";

/* Content Security Policy (pre-launch QA, 8 Oct 2026). What the site loads, and from where:
   its own scripts, styles, images, video, fonts and 3D models; Next's inline page data (hence
   'unsafe-inline' for scripts: the pages are static, so a per-request nonce is not available);
   'wasm-unsafe-eval' for the 3D models' mesh decoder; Cloudflare Turnstile (the enquiry form's
   bot check, script and frame); the Google Maps embed on the Visit section; Vercel Analytics,
   which is served from the site's own origin. Nothing else may run, frame it or be framed. */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://www.google.com https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  // no upgrade-insecure-requests: every URL is the site's own and HSTS keeps it on https, and
  // WebKit applies it even to http://localhost, which broke every local test in Safari's engine
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // This app keeps its own lockfile and node_modules inside the monorepo; without this Next
  // guesses the repo root from the lockfile one level up and warns on every build.
  outputFileTracingRoot: path.join(__dirname),
  // read by lib/business.ts (LAUNCH, PREVIEW_COMPARE) in server and client code alike, so both
  // sides of a page agree; Vercel sets VERCEL_ENV at build, and it is not otherwise in the browser
  env: { VERCEL_ENV: process.env.VERCEL_ENV ?? "", HIDE_UNCONFIRMED: process.env.HIDE_UNCONFIRMED ?? "" },
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // five widths cover a phone at 3x to a 4K screen; every extra one adds a URL to every
    // <img> on the page (the home page carried 95 KB of srcset) and a transformation to bill
    deviceSizes: [480, 750, 1080, 1440, 1920],
    imageSizes: [96, 240],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // iOS and a few crawlers ask for /apple-touch-icon.png at the root by convention
  // whatever the <link> says. Next serves the app icon at /apple-icon.png, so without
  // these two lines those requests are a 404 in the log for no reason.
  async rewrites() {
    return [
      { source: "/apple-touch-icon.png", destination: "/apple-icon.png" },
      { source: "/apple-touch-icon-precomposed.png", destination: "/apple-icon.png" },
    ];
  },
  // Old site URLs → new equivalents. The old site was never indexed (noindex +
  // Vercel login), so these protect shared links rather than rankings.
  async redirects() {
    return [
      { source: "/collection", destination: "/#collections", permanent: true },
      // pieces retitled 8 Oct 2026 (the old titles misnamed them); the trailing id is unchanged
      { source: "/pieces/bullion/fifa-world-cup-gold-bar-cards-0ab6cf47", destination: "/pieces/bullion/fifa-world-cup-5-oz-silver-coin-in-ticket-box-0ab6cf47", permanent: true },
      { source: "/pieces/bullion/fifa-world-cup-gold-ticket-card-24176be3", destination: "/pieces/bullion/fifa-world-cup-5-oz-silver-coin-ticket-box-24176be3", permanent: true },
      { source: "/pieces/bullion/pamp-gold-bar-in-assay-card-5cdb5c2e", destination: "/pieces/bullion/pamp-barbie-5-g-gold-coin-in-assay-card-5cdb5c2e", permanent: true },
      { source: "/pieces/watches/datejust-41-azzurro-116334-2018-box-booklets-and-card-5bf77de9", destination: "/pieces/watches/datejust-ii-azzurro-116334-2018-box-booklets-and-card-5bf77de9", permanent: true },
      // watches named by their model (8 Oct 2026, Shaun: "make sure it says the specific watch, the specific brand"); the trailing id is unchanged
      { source: "/pieces/watches/datejust-steel-and-yellow-gold-roman-numeral-dial-fluted-bezel-jubilee-2184a9f5", destination: "/pieces/watches/datejust-41-steel-and-yellow-gold-roman-numeral-dial-fluted-bezel-jubi-2184a9f5", permanent: true },
      { source: "/pieces/watches/gold-diver-blue-dial-2b53eb0c", destination: "/pieces/watches/submariner-date-yellow-gold-blue-dial-2b53eb0c", permanent: true },
      { source: "/pieces/watches/royal-pop-green-watch-boxed-33cc7c8f", destination: "/pieces/watches/royal-pop-green-eight-boxed-33cc7c8f", permanent: true },
      { source: "/pieces/watches/two-tone-submariner-black-dial-full-set-5cf459b5", destination: "/pieces/watches/submariner-date-steel-and-yellow-gold-black-dial-full-set-5cf459b5", permanent: true },
      { source: "/pieces/watches/day-date-pave-dial-gem-set-bezel-president-bracelet-7f93acb2", destination: "/pieces/watches/day-date-40-pave-dial-gem-set-bezel-president-bracelet-7f93acb2", permanent: true },
      { source: "/pieces/watches/day-date-pave-dial-gem-set-bezel-president-bracelet-8bb44ba1", destination: "/pieces/watches/day-date-40-pave-dial-gem-set-bezel-president-bracelet-8bb44ba1", permanent: true },
      { source: "/pieces/watches/steel-chronograph-black-dial-9c5e0b66", destination: "/pieces/watches/cosmograph-daytona-steel-black-dial-9c5e0b66", permanent: true },
      { source: "/pieces/watches/square-steel-watch-green-dial-b1707791", destination: "/pieces/watches/santos-de-cartier-steel-green-dial-b1707791", permanent: true },
      { source: "/pieces/watches/green-dial-diamond-bezel-e3bf299e", destination: "/pieces/watches/datejust-41-green-dial-diamond-bezel-e3bf299e", permanent: true },
      { source: "/pieces/watches/steel-diver-green-bezel-ea056444", destination: "/pieces/watches/submariner-date-steel-green-bezel-ea056444", permanent: true },
      { source: "/pieces/watches/datejust-steel-and-yellow-gold-ivory-roman-dial-jubilee-bracelet-eb26f164", destination: "/pieces/watches/datejust-36-steel-and-yellow-gold-ivory-roman-dial-jubilee-bracelet-eb26f164", permanent: true },
      { source: "/pieces/watches/datejust-steel-and-yellow-gold-slate-wimbledon-dial-jubilee-bracelet-f26b7489", destination: "/pieces/watches/datejust-41-steel-and-yellow-gold-slate-wimbledon-dial-jubilee-bracele-f26b7489", permanent: true },
      { source: "/collection/", destination: "/#collections", permanent: true },
      { source: "/piece/:id*", destination: "/#collections", permanent: true },
      { source: "/part-exchange", destination: "/enquiry?type=part-exchange", permanent: true },
      { source: "/part-exchange/", destination: "/enquiry?type=part-exchange", permanent: true },
      { source: "/contact", destination: "/#visit", permanent: true },
      { source: "/contact/", destination: "/#visit", permanent: true },
    ];
  },
};

export default nextConfig;
