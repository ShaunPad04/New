import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOT setting experimental.inlineCss. It was measured, three samples each
  // way: it removes the render-blocking stylesheet request and cut Total
  // Blocking Time from 173ms to 134ms, but it pushed First Contentful Paint
  // from 916ms [911–1001] to 1165ms [1155–1214] — non-overlapping, so a real
  // regression — because the document itself grows by the whole stylesheet.
  // Performance scored 91 [91–92] against 92 [89–93], indistinguishable.
  // Paint sooner beats a slightly quieter main thread here.
  images: {
    // Next 16 restricts qualities to [75] by default. The café's photography
    // is warm and low-contrast, where banding in the soft gradients shows
    // early, so hero-scale images are served at 90.
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
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
