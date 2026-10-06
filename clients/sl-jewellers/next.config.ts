import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [400, 640, 800, 1080, 1200, 1600, 1920],
    imageSizes: [96, 160, 240, 320],
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
