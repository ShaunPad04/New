import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

/**
 * SOCIAL SHARE CARD
 *
 * Generated at build time rather than committed as a PNG, so the wordmark and
 * the strapline cannot drift from `content.ts` the way a hand-exported image
 * would. One file at the app root covers every route — Next inherits it
 * wherever a segment does not define its own.
 *
 * WHY IT EXISTS. `twitter.card` was already set to `summary_large_image`,
 * which is a promise of an image, and no image was ever declared. Every link
 * pasted into WhatsApp, LinkedIn, Slack or iMessage rendered as a grey box —
 * on a studio whose entire argument is visual craft, and at exactly the moment
 * a prospect first sees the name.
 *
 * Set in Geist, which is the site's own body face: `next/og` bundles
 * Geist-Regular and uses it as the default, so this needs no font file of its
 * own and adds nothing to the repo. The display face is Archivo and is not
 * available here — at this size, on one line, the difference is a slightly
 * softer letterform rather than a different brand.
 *
 * Monochrome, per the locked palette. The hairline under the wordmark is the
 * black line the studio is named after.
 */
export const alt = `${site.name} — web design and online marketing`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          padding: "72px 80px",
        }}
      >
        {/* A soft key from the upper left, the same raked light the hero
            plate uses. Radial gradients are supported by satori; the layer
            is absolutely positioned so it cannot affect the flex layout. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(900px circle at 18% 8%, rgba(255,255,255,0.10), rgba(0,0,0,0) 60%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#808080",
            }}
          >
            Founder-led studio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              letterSpacing: "-0.035em",
              color: "#ffffff",
              lineHeight: 1,
            }}
          >
            {site.logotype}
          </div>

          {/* The black line, drawn in white because the ground is black. */}
          <div
            style={{
              display: "flex",
              width: 220,
              height: 2,
              marginTop: 36,
              background: "#ffffff",
            }}
          />

          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 34,
              color: "#d4d4d4",
              letterSpacing: "-0.01em",
            }}
          >
            Web design, search, email and SMS.
          </div>
        </div>
      </div>
    ),
    size
  );
}
