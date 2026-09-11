import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restricts qualities to [75] by default. Watch photography is
    // near-black with fine specular gradients, where banding shows early.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
  // This is a pitch preview. Nothing here may be indexed until the inventory
  // is real — see src/app/robots.ts and src/lib/content.ts.
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
