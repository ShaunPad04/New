import { Cal_Sans } from "next/font/google";
import localFont from "next/font/local";

/**
 * The homepage hero's two faces, shared with the preloader that sits beside
 * it. Declared here rather than in the layout so only `/` downloads them;
 * next/font self-hosts both at build.
 */
const cal = Cal_Sans({ weight: "400", subsets: ["latin"], variable: "--font-cal", display: "swap" });
// The brush script (Mr Dafoe, OFL): the load screen's line (white) and the
// hero's (red). Self-hosted as a SUBSET — lowercase a-z and . , ' ’ - ! ? only
// (3.9KB, was 17.3KB) — because both lines are `heroScrubLine.toLowerCase()`.
// Any other character falls back to the next font; re-subset from the Google
// file with fontTools if the line ever needs more. A thin Sacramento was
// tried on the hero on 2026-09-28 and dropped the next day (Brad).
const script = localFont({
  src: "../../app/fonts/MrDafoe-lowercase.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const heroFonts = `${cal.variable} ${script.variable}`;
