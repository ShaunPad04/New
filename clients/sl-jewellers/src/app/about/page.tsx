import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS, LAUNCH } from "@/lib/content";
import { readAbout } from "@/lib/about";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";

export const metadata: Metadata = {
  title: "About us",
  description: "S&L Jewellers is an independent shop on Cambridge Street, Cleethorpes. Gold, silver and watches, bought and sold over the counter.",
  alternates: { canonical: "/about" },
};

/**
 * About S&L, its own page (6 Oct 2026, Shaun: not on the homepage, in the menu). The copy is
 * content/about.md, unchanged; the picture is the shop's own interior.
 */
export default function AboutPage() {
  const b = BUSINESS;
  const { paragraphs, todos } = readAbout();
  return (
    <div className="on-black">
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
          </Reveal>
          <Reveal className="about-photo">
            <Image
              src="/images/shop-interior.jpg"
              alt="Inside S&L Jewellers: the counter, the display cases and the gold S&L sign on the wall"
              width={720}
              height={1068}
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
