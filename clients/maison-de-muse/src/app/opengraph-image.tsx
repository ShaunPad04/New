import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — Coffee Shop & Wine Bar, Cleethorpes`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social sharing image, rendered at build time. Designed rather than
 * photographic so it never depends on an asset being present; swap in a
 * photograph by replacing this file with a static opengraph-image.jpg.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(160deg, #fbf7f1 0%, #f4e3d5 55%, #ead0c6 100%)",
          color: "#2b1d18",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 999,
              border: "2px solid rgba(43,29,24,0.25)",
              fontSize: 32,
            }}
          >
            M
          </div>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 88, lineHeight: 1, letterSpacing: -2 }}>Coffee, food and</div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1,
              letterSpacing: -2,
              fontStyle: "italic",
              color: "#5b2a3a",
            }}
          >
            effortless elegance.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "#74645c",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          <span>
            {site.address.street}, {site.address.town} {site.address.postcode}
          </span>
          <span>Open from 7am</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
