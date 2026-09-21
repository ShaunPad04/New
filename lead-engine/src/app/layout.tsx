import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlackLine Lead Engine",
  description: "Automated qualified-lead generation for Cambridge Mews Accommodation.",
  robots: { index: false, follow: false },
};

/**
 * Every screen reflects live database state, so nothing is prerendered.
 * Route segment config on the root layout applies to every segment below it.
 */
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh antialiased">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(255,255,255,0.06),transparent_60%)]"
        />
        <Nav />
        <main className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-6 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
