import type { Metadata, Viewport } from "next";
import { Geist, Archivo, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/lib/content";
import { SmoothScroll } from "@/components/smooth-scroll";
import { HashScroll } from "@/components/hash-scroll";
import { SpotlightCursor } from "@/components/spotlight-cursor";
import "./globals.css";

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
 * Clash Display — the footer's signature face.
 *
 * Client request (2026-09-15), matched off the reference he sent: the marquee
 * band and the footer's link columns are Clash Display, not Archivo.
 *
 * SELF-HOSTED, NOT FROM FONTSHARE'S CDN, and that is not a preference. The
 * privacy policy states in writing that every asset including the typefaces
 * is served from this site's own domain, and `tests/a11y.spec.ts` asserts
 * zero third-party requests on the homepage. A `@import` from
 * api.fontshare.com would break the promise and the test together. The two
 * weights are committed as woff2 in `src/fonts` (15KB each) and next/font
 * fingerprints and serves them from our origin.
 *
 * LICENCE: Fontshare (Indian Type Foundry), free for personal and commercial
 * use. Unlike the Google faces above, nothing re-downloads this at build —
 * the files in the repo ARE the font, so keep them.
 *
 * THIS IS A THIRD FAMILY and the studio standard says two. It earns its place
 * only while it stays the footer's signature; the moment it starts appearing
 * in body copy or route headings, either it replaces Archivo everywhere or it
 * comes out. Do not spread it quietly.
 */
const clashDisplay = localFont({
  variable: "--font-clash",
  display: "swap",
  src: [
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
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
    index: process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true",
    follow: process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true",
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
      className={`${geistSans.variable} ${archivo.variable} ${clashDisplay.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-ink-0 text-ink-1000 flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-1000 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <HashScroll />
        {/* A soft light following the pointer. Desktop and hover-capable
            devices only, and it draws a frame only when the pointer moves —
            see the component for why the original's permanent loop could not
            ship on this page. */}
        <SpotlightCursor />
        {children}
      </body>
    </html>
  );
}
