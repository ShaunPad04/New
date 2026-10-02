import type { Metadata, Viewport } from "next";
import { Geist, Archivo, Geist_Mono, Cal_Sans, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { site, SITE_INDEXABLE } from "@/lib/content";
import { SmoothScroll } from "@/components/smooth-scroll";
import { RevealObserver } from "@/components/reveal-observer";
import { ScrollMeter } from "@/components/kit/scroll-meter";
import { HashScroll } from "@/components/hash-scroll";
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
  preload: false, // Neiden-fonts trial: DM Sans is the body face for now
});

/**
 * NEIDEN-FONTS TRIAL (Brad, 2026-09-28: "can we try the Neiden fonts for the
 * whole website"). Neiden sets Cal Sans (display) + DM Sans (body); its third
 * face, Inter, is banned here and left out. Switched in ONE place: the
 * `--font-sans` / `--font-display` lines in globals.css. To revert, point
 * those back at Geist / Archivo and restore the two `preload` flags.
 */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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
  preload: false, // Neiden-fonts trial: Cal Sans is the display face for now
});

/**
 * Clash Display, Semibold only (Brad, 2026-09-26: the homepage intro line,
 * "P3", after porto-template.framer.website). Fontshare / Indian Type
 * Foundry, ITF Free Font License, which permits commercial web use. Self-
 * hosted from src/app/fonts so the site still makes no third-party
 * requests. Not preloaded: it is used below the fold only, and a preload
 * would put its bytes in front of the hero's first paint. Subset
 * (2026-09-29) to Basic Latin, Latin-1, curly quotes, dashes, the ellipsis,
 * € and ™: 7.9KB, was 15.3KB. Re-subset if the line gains other characters.
 */
const clash = localFont({
  src: "./fonts/ClashDisplay-Semibold.woff2",
  variable: "--font-clash",
  weight: "600",
  display: "swap",
  preload: false,
});

/**
 * Cal Sans: the menu's route names (2026-09-28) and, during the Neiden-fonts
 * trial, every display heading, so it is preloaded. The homepage hero
 * declares its own Cal Sans; both resolve to the same file.
 */
const calUi = Cal_Sans({
  variable: "--font-cal-ui",
  weight: "400",
  subsets: ["latin"],
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

/*
 * A RELOAD of `/` opens on the hero (Brad, 2026-09-28: reloading from
 * /#contact opened on the form), with no visible jump: phones have no load
 * screen to hide one (2026-10-02). Chrome restores the old scroll position
 * at the reloaded page's first layout, before any of its scripts can stop
 * it, so the page being LEFT marks `/` "manual" on pagehide (a bfcache
 * return hands back "auto"). The reloaded page drops the #hash before the
 * parser reaches #contact. If the leaving page could not mark it, Chrome
 * restores, and the page goes to the top on load instead. Either way the
 * mode is "auto" again after load, so in-site back/forward restores as
 * normal. In the layout so it is registered whichever page a visit starts
 * on; server HTML only, never run again on client navigations.
 */
const RELOAD_TO_TOP = `(function () {
  addEventListener("pagehide", function () { if (location.pathname === "/") history.scrollRestoration = "manual"; });
  addEventListener("pageshow", function (e) { if (e.persisted) history.scrollRestoration = "auto"; });
  if (location.pathname !== "/" || performance.getEntriesByType("navigation")[0]?.type !== "reload") return;
  var restored = history.scrollRestoration !== "manual";
  history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
  addEventListener("load", function () {
    if (restored) { scrollTo(0, 0); window.__lenis && window.__lenis.scrollTo(0, { immediate: true }); }
    setTimeout(function () { history.scrollRestoration = "auto"; });
  });
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${dmSans.variable} ${archivo.variable} ${geistMono.variable} ${clash.variable} ${calUi.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-ink-0 text-ink-1000 flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: RELOAD_TO_TOP }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-1000 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <RevealObserver />
        {/* v2: reading-progress hairline on every page. */}
        <ScrollMeter />
        <HashScroll />
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
