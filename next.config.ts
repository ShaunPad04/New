import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restricts qualities to [75] by default. The hero is a large
    // monochrome photograph where banding shows early, so it is served at 90.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
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
