import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_URL } from "@/lib/content";
import Header from "@/components/Header";
import SiteMenu from "@/components/menu/SiteMenu";
import BasketDrawer from "@/components/basket/BasketDrawer";
import Footer from "@/components/Footer";
import ReviewsBand from "@/components/ReviewsBand";
import MotionRoot from "@/components/motion/MotionRoot";
import Shine from "@/components/motion/Shine";
import ButtonFX from "@/components/motion/ButtonFX";

/* One family for everything: Archivo with its width axis (6 Oct 2026). Shaun first chose a
   wide watch-dial look ("like Michroma"), set at 118% width, found it too wide, and picked the
   semi-expanded cut (font-stretch 108%) from six options rendered on the site. Headings, the
   nav, labels and buttons run semi-expanded capitals; reading text runs at normal width.
   Replaces Outfit (display) and Manrope (body). */
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

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
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
};

const SWITCH = `(function(){try{var h=document.documentElement,s=sessionStorage,q=new URLSearchParams(location.search).get("v");
if(q!==null){if(q===""||q==="reset"){s.removeItem("slj-v");q="";}else s.setItem("slj-v",q);}else q=s.getItem("slj-v")||"";
var css="";q.split(",").forEach(function(p){var m=p.split(":"),k=m[0],d=m[1];if(!/^[a-z-]{2,20}$/.test(k)||!/^[a-c]$/.test(d))return;
h.setAttribute("data-x-"+k,d);css+='[data-x="'+k+'"][data-x-dir]{display:none!important}[data-x="'+k+'"][data-x-dir="'+d+'"]{display:contents!important}';});
if(css){var t=document.createElement("style");t.textContent=css;document.head.appendChild(t);}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* Preview switch for Shaun's section-by-section walk-through (6 Oct 2026): ?v=header:b,menu:c
            shows those variants (remembered for the tab; ?v=reset clears it). Runs before paint,
            so the page never flashes the default. Removed when the walk-through ends. */}
        <script dangerouslySetInnerHTML={{ __html: SWITCH }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <Header />
        <SiteMenu />
        <BasketDrawer />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <ReviewsBand />
        <Footer />
        <MotionRoot />
        <Shine />
        <ButtonFX />
        {process.env.VERCEL === "1" && <Analytics />}
      </body>
    </html>
  );
}
