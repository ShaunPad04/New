import type { Metadata, Viewport } from "next";
import { Geist, Archivo, Geist_Mono, Instrument_Serif } from "next/font/google";
import { site, SITE_INDEXABLE } from "@/lib/content";
import { SmoothScroll } from "@/components/smooth-scroll";
import { RevealObserver } from "@/components/reveal-observer";
import { HashScroll } from "@/components/hash-scroll";
import { SpotlightCursor } from "@/components/spotlight-cursor";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

/**
 * Body/UI face.
 *
 * Geist, not Inter — the house `high-end-visual-design` standard explicitly
 * bans Inter, Roboto, Arial, Open Sans and Helvetica as the fonts that make a
 * build read as generic. Geist is on its allowed list.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Display face. Archivo is a variable grotesque with a genuine heavy end —
 * the weight the client's reference leans on for large uppercase headlines.
 * Only the weights actually used are requested, so the payload stays small.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  display: "swap",
});

/**
 * Editorial display face (design system v2, 2026-09-25).
 *
 * Instrument Serif is the free face that comes closest to the paid editorial
 * serifs (PP Editorial New, Canela): high contrast, narrow, with a true
 * italic. Brad's call — a £0 font budget, and "get us the closest one".
 * It carries every section headline; Archivo stays on the brand marks (the
 * wordmark, the hero logotype), which are client-approved identity, not
 * typography choices to revisit.
 *
 * One weight exists (400) plus its italic, which suits a display face: the
 * contrast comes from scale, not weight.
 */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Web Design, SEO, Email & SMS`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Web Design, SEO, Email & SMS`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Web Design, SEO, Email & SMS`,
    description: site.description,
  },
  robots: {
    index: SITE_INDEXABLE,
    follow: SITE_INDEXABLE,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${archivo.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-ink-0 text-ink-1000 flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-1000 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <RevealObserver />
        <HashScroll />
        {/* A soft light following the pointer. Desktop and hover-capable
            devices only, and it draws a frame only when the pointer moves —
            see the component for why the original's permanent loop could not
            ship on this page. */}
        <SpotlightCursor />
        {children}
        {/*
          VERCEL WEB ANALYTICS.

          Chosen over Google Analytics deliberately, and the difference is
          not cosmetic: this sets NO cookie, writes nothing to localStorage
          or sessionStorage, and serves its script and its beacon from
          `/_vercel/insights/*` — first-party paths on this origin, not a
          third-party host. So the three facts the privacy policy and the
          test suite assert about this site all still hold.

          What DID change is the sentence "it contains no analytics", which
          was true until this line existed. `legal.ts` was updated in the
          same commit to say what is now collected and why. A privacy policy
          that describes a site you no longer run is worse than no policy.

          PECR reg. 6 governs storing or accessing information on someone's
          device. This does neither, so a consent banner is not engaged —
          which is exactly why this was the analytics worth having. If it is
          ever swapped for anything cookie-based, the banner comes with it.
        */}
        <Analytics />
      </body>
    </html>
  );
}
