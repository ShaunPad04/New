import type { NextConfig } from "next";

/**
 * CONTENT SECURITY POLICY
 *
 * Measured against the built output rather than copied from a template. What
 * this site actually loads: every script from `/_next/static`, no external
 * script, style, font, image or media origin at all, and no third-party
 * request of any kind — which is the same fact the privacy policy asserts and
 * the test suite enforces.
 *
 * WHY `script-src` CARRIES 'unsafe-inline', WHICH IS NOT IDEAL AND IS THE
 * HONEST CHOICE HERE.
 *
 * Next emits four inline <script> blocks per page carrying the RSC payload.
 * Allowing them needs either a nonce or a hash. A hash cannot work — the
 * payload differs per page and per build. A nonce has to be generated per
 * request in middleware, and reading it opts EVERY route out of static
 * rendering: this site is almost entirely static, its mobile LCP is the
 * number the studio sells, and trading that for a directive is the wrong
 * side of the deal on a site that renders no user-generated content
 * anywhere. There is no stored XSS surface here to defend.
 *
 * So the value is in the other directives, and it is real:
 *
 *   default-src 'self'   no external resource of any kind loads
 *   script-src  'self'   an injected <script src="//evil"> is BLOCKED, which
 *                        is how exfiltration payloads usually arrive
 *   connect-src 'self'   fetch/XHR/beacon to anywhere else is blocked, so
 *                        even a successful injection cannot phone home
 *   form-action 'self'   an injected form cannot post to another origin
 *   base-uri    'self'   blocks <base> hijacking, which silently repoints
 *                        every relative script URL on the page
 *   object-src  'none'   kills the plugin/embed vector outright
 *   frame-ancestors      clickjacking
 *
 * Revisit the moment this site gains user-generated content, a comments
 * feature, or a CMS that lets anyone but us author a page — at that point the
 * XSS surface exists, and the nonce is worth the static rendering.
 *
 * `style-src` needs 'unsafe-inline' unconditionally: the hero scrub, the
 * reveals and the cursor plate all write inline style attributes, 367 of them
 * on the homepage alone. Style injection is a far lower-severity vector than
 * script injection and there is no way to animate this site without it.
 *
 * `img-src` takes data: and blob: for next/image's blur placeholders.
 * `media-src` covers the work preview videos when any are supplied, and
 * takes blob: for the hero film, which is played from memory (hero-film.tsx).
 */
const CSP = [
  "default-src 'self'",
  // Dev only: React's dev build uses eval() to rebuild error call stacks, and
  // without it the dev overlay shows an "eval() is not supported" error.
  // Production never uses eval, so the live CSP is unchanged.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self' blob:",
  // The /ai voice demo (2026-10-06): Retell's API and its media relay. Only
  // contacted after a visitor presses "Talk to our AI receptionist".
  "connect-src 'self' https://api.retellai.com wss://*.livekit.cloud https://*.livekit.cloud",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  // Not in dev: over plain http on a LAN address (a phone testing the dev
  // server) it rewrote every CSS, font and image request to https, which the
  // dev server cannot answer, so the page loaded unstyled. localhost is
  // exempt, which is why it only showed on the phone. Production unchanged.
  ...(process.env.NODE_ENV === "development" ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  // Dev only: lets a phone on the home network load the dev server's
  // scripts (Next blocks other hosts by default). No effect on a build.
  allowedDevOrigins: ["192.168.0.117"],
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
     *
     * 2880 added 2026-10-02 for the 4K case-study pictures: a 2x laptop at
     * 1440 wide needs ~2708px for a full-width frame and was getting the
     * 3840 file (B Boutique 622KB at q75); 2880 is ~56% of those pixels.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1366, 1920, 2048, 2880, 3840],
  },
  // Preview deployments must not be indexed. Production sets
  // NEXT_PUBLIC_SITE_INDEXABLE=true — see src/app/robots.ts.
  poweredByHeader: false,
  /* /services/ai was replaced by /ai, the AI automation page (2026-10-06):
     same two systems, same demos, so one page, not two competing for the
     same searches. Permanent, so Google moves the old page's standing over. */
  async redirects() {
    return [{ source: "/services/ai", destination: "/ai", permanent: true }];
  },
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
          {
            key: "Content-Security-Policy",
            value: CSP,
          },
          /*
            Clickjacking. `frame-ancestors` in the CSP above is the modern
            control and the one that actually governs; this is kept beside it
            for the browsers and scanners that still only read the old header.
            DENY rather than SAMEORIGIN: nothing on this site frames itself.
          */
          { key: "X-Frame-Options", value: "DENY" },
          /*
            HSTS. Two years, and subdomains included so a forgotten staging
            host cannot be served over plain HTTP and used to set cookies for
            the parent domain.

            `preload` IS DELIBERATELY ABSENT. Submitting to the browser preload
            list is close to irreversible — removal takes months to propagate
            through browser releases — and it would commit every present and
            future subdomain to HTTPS before this site is even live. It is a
            decision to take once the domain is in production and every
            subdomain is known, not a default to inherit.

            Vercel sets its own HSTS on custom domains. Setting it here means
            the policy is the repository's, visible in review, and identical
            wherever this is deployed.
          */
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
