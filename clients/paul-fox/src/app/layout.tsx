import type { Metadata, Viewport } from "next";
import { Onest, Urbanist } from "next/font/google";
import { site } from "@/lib/content";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FindUs } from "@/components/find-us";
import { ChatWidget } from "@/components/chat-widget";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1b1b28",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${urbanist.variable} ${onest.variable}`}>
      <body className="header-offset">
        <SmoothScroll>
          <Nav />
          {children}
          <FindUs />
          <Footer />
        </SmoothScroll>
        <ChatWidget />
      </body>
    </html>
  );
}
