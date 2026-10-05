import type { Metadata, Viewport } from "next";
import { Outfit, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_URL, BUSINESS } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBar from "@/components/StickyBar";
import MotionRoot from "@/components/motion/MotionRoot";
import Shine from "@/components/motion/Shine";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-outfit", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "S&L Jewellers | Gold, Watches and We Buy Gold, Cleethorpes",
    template: "%s | S&L Jewellers, Cleethorpes",
  },
  description:
    "Independent jewellers on Cambridge Street, Cleethorpes. Gold chains, rings and pre-owned watches, bought and sold over the counter. We buy gold, precious metals and watches. Jewellery repairs and soldering.",
  applicationName: "S&L Jewellers",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "S&L Jewellers",
    url: SITE_URL,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "S&L Jewellers, Cleethorpes" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${outfit.variable} ${manrope.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <StickyBar phone={BUSINESS.phone.e164} />
        <MotionRoot />
        <Shine />
        {process.env.VERCEL === "1" && <Analytics />}
      </body>
    </html>
  );
}
