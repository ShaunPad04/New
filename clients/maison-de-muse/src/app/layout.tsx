import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/smooth-scroll";
import { RevealEngine } from "@/components/reveal-engine";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

/**
 * Body/UI face. Manrope — a quiet contemporary sans that stays legible in
 * the menu's small sizes without reading as a system font.
 */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * Display face. Cormorant Garamond at the two weights actually used, plus
 * one italic for the second beat of a headline. Nothing lighter than 500 is
 * loaded: at small sizes the light cuts fall below the contrast bar.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const TITLE = `${site.name} — Coffee Shop & Wine Bar, Cleethorpes`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: TITLE,
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
    title: TITLE,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: site.description,
  },
  robots: {
    index: process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true",
    follow: process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f1",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col bg-ivory text-espresso">
        {/* Marks the document as scripted BEFORE first paint, which is what
            arms the scroll-reveal hidden state in globals.css. Without it
            every section stays visible — the safe direction. The timeout is
            a failsafe: if the bundle never executes, nothing can be left
            hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');setTimeout(function(){if(!window.__revealReady){document.querySelectorAll('[data-reveal]').forEach(function(n){n.setAttribute('data-revealed','')})}},4000)",
          }}
        />
        <RevealEngine />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-plum focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-cream"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
