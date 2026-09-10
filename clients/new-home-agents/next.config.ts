import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    // Listing photography is served from this project (public/images/
    // properties). The agency's listing media host is allowed as a fallback
    // for any listing whose photographs were not mirrored locally.
    remotePatterns: [
      { protocol: "https", hostname: "med04.expertagent.co.uk" },
      { protocol: "https", hostname: "www.newhomeagents.co.uk" },
    ],
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
