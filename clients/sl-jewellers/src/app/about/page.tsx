import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS, LAUNCH } from "@/lib/content";
import { readAbout } from "@/lib/about";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import AboutMark from "@/components/AboutMark";

export const metadata: Metadata = {
  title: "About us",
  description: "S&L Jewellers is an independent shop on Cambridge Street, Cleethorpes. Gold, silver and watches, bought and sold over the counter.",
  alternates: { canonical: "/about" },
};

/**
 * About S&L, its own page (6 Oct 2026, Shaun: not on the homepage, in the menu). It opens on
 * the S&L mark in 3D (AboutMark: turn it, tap it apart), then the copy (content/about.md, cut
 * to a few lines at Shaun's request on 8 Oct 2026) beside the shop's own interior photo.
 */
export default function AboutPage() {
  const b = BUSINESS;
  const { paragraphs, todos } = readAbout();
  return (
    <div className="on-black">
      <section className="amark" aria-label="The S&L mark">
        <AboutMark />
        <p className="amark-tl" aria-hidden="true">
          <span className="amark-idx">(S&amp;L)</span> The mark of the shop
        </p>
        <p className="amark-bl" aria-hidden="true">
          {b.address.street}
          <br />
          {b.address.town} {b.address.postcode}
        </p>
      </section>
      <section className="section" aria-labelledby="about-title">
        <div className="wrap about-page">
          <Reveal>
            <p className="eyebrow">About S&amp;L</p>
            <SplitHeading as="h1" load id="about-title" text={"The shop on\n*Cambridge Street.*"} className="display-l" />
            <div className="about-copy mt-8 text-[17px] text-paper/80">
              {paragraphs.map((p, i) =>
                p.startsWith("## ") ? (
                  <h2 key={i} className="display-s text-paper">
                    {p.slice(3)}
                  </h2>
                ) : (
                  <p key={i} className="max-w-[58ch]">
                    {p}
                  </p>
                ),
              )}
            </div>
            {!LAUNCH &&
              todos.map((t) => (
                <p key={t} className="mt-4">
                  <span className="todo">{t}</span>
                </p>
              ))}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/enquiry" className="btn btn-metal">
                Make an enquiry
              </Link>
              <a href={b.social.google.directionsUrl} target="_blank" rel="noopener" className="btn btn-metal">
                Get directions
              </a>
            </div>
            <p className="mt-6 text-xs text-wall">S&amp;L is not affiliated with the brands it sells.</p>
          </Reveal>
          <Reveal className="about-photo">
            <Image
              src="/images/shop-interior.2026-10-06.webp"
              alt="Inside S&L Jewellers: the black glass counters, the display cases and the gold S&L sign on the wall"
              width={1200}
              height={1789}
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
