import { Cal_Sans, Mr_Dafoe } from "next/font/google";

/**
 * The homepage hero's two faces, shared with the preloader that sits beside
 * it. Declared here rather than in the layout so only `/` downloads them;
 * next/font self-hosts both at build.
 */
const cal = Cal_Sans({ weight: "400", subsets: ["latin"], variable: "--font-cal", display: "swap" });
// The brush script: the load screen's line (white) and the hero's (red).
// A thin Sacramento was tried on the hero on 2026-09-28 and dropped the next
// day for this one (Brad).
const script = Mr_Dafoe({ weight: "400", subsets: ["latin"], variable: "--font-script", display: "swap" });

export const heroFonts = `${cal.variable} ${script.variable}`;
