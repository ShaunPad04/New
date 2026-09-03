import type { Metadata, Viewport } from "next";
import { Inter, Archivo, Geist_Mono } from "next/font/google";
import { site } from "@/lib/content";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
      className={`${inter.variable} ${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-ink-0 text-ink-1000 flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-1000 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
