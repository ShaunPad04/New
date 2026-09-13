import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restricts qualities to [75] by default. The hero is a large
    // monochrome photograph where banding shows early, so it is served at 90.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
    /*
     * 1366 added to the default ladder (640, 750, 828, 1080, 1200, 1920).
     *
     * The gap between 1200 and 1920 is where this site's real slots fall: a
     * work card needs 1250px on a 2x tablet and 1166px on a 2x desktop, so
     * both were rounding up to 1920 and fetching roughly 60% more pixels
     * than they can show. Measured after correcting the `sizes` attribute,
     * which fixed the phone cases but could not fix these two.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1366, 1920, 2048, 3840],
  },
  // Preview deployments must not be indexed. Production sets
  // NEXT_PUBLIC_SITE_INDEXABLE=true — see src/app/robots.ts.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
