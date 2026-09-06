import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { business, site, SITE_INDEXABLE } from "@/lib/content";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

/**
 * Display face.
 *
 * Playfair Display — a high-contrast transitional serif. It is the face the
 * reference hero uses, and the right register for a Mayfair vintage dealer:
 * the thin-to-thick stroke contrast reads as engraved rather than typed.
 * Only 400 and 500 are requested; the design never sets it bold.
 */
const playfair = Playfair_Display({
  variable: "--font-serif-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/**
 * Body/UI face. Geist, not Inter — the house standard bans Inter, Roboto,
 * Arial, Open Sans and Helvetica outright, fallback stacks included.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Reference numbers, years, case sizes and section labels. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${business.name}` },
  description: site.description,
  // Indexing is opt-in and production-only. A pitch preview carrying demo
  // stock must never be crawlable — see src/app/robots.ts.
  robots: SITE_INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    siteName: business.name,
    locale: "en_GB",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body
        className={`${playfair.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-obsidian"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
