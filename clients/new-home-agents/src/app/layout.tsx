import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Special_Gothic } from "next/font/google";
import { site } from "@/lib/content";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

/**
 * Body/UI face: Switzer (Indian Type Foundry, via Fontshare under the ITF
 * Free Font Licence) — the face the reference renders in. Files live in
 * public/fonts/switzer, mirrored by the capture workflow.
 */
const switzer = localFont({
  variable: "--font-switzer",
  display: "swap",
  src: [
    { path: "../../public/fonts/switzer/switzer-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/switzer/switzer-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/switzer/switzer-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/switzer/switzer-700-normal.woff2", weight: "700", style: "normal" },
  ],
});

/** Display face for the homepage headline, as on the reference. */
const specialGothic = Special_Gothic({
  variable: "--font-special-gothic",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: indexable, follow: indexable },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${switzer.variable} ${specialGothic.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[12px] focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
