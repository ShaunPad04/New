import Image from "next/image";
import Link from "next/link";
import { reviews, reviewsSource } from "@/lib/content";
import { SectionHeading } from "@/components/section-heading";

/**
 * Client reviews — reference: a continuous horizontal ticker (70px/s,
 * linear, pauses on hover) of 400×500 cards in #f6f6f6 with a 15px radius
 * and 32px padding — a quote mark, the 16px/500 message, the reviewer at
 * the bottom — closed on the right by a tall portrait card. The agency
 * publishes its reviews unattributed, so each card's footer says exactly
 * that; the portrait card is an illustrative, AI-generated figure with no
 * name or job title attached, inviting the reader to talk to the team.
 *
 * Slides are divs with role="group", not list items: a moving duplicate set
 * inside a list would fail the axe `list` rule.
 */
export function Reviews() {
  const cards = [...reviews, ...reviews];
  const duration = Math.round((reviews.length * 424) / 70);
  return (
    <section className="relative z-10 overflow-hidden bg-white" aria-labelledby="reviews-heading">
      <div className="container section pb-0">
        <SectionHeading eyebrow="Customer reviews" title="What people say about moving with us" description={reviewsSource + "."} />
      </div>
      <div className="container mt-16 grid gap-6 pb-20 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="marquee -mx-4 min-w-0 overflow-hidden md:-mx-8" role="region" aria-label="Customer reviews carousel">
          <div className="marquee-track gap-6 px-4 md:px-8" style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
            {cards.map((r, i) => (
              <div
                key={i}
                role="group"
                aria-hidden={i >= reviews.length}
                aria-label={`Review ${(i % reviews.length) + 1} of ${reviews.length}`}
                className="flex h-[400px] w-[320px] shrink-0 flex-col justify-between rounded-[15px] bg-mist p-8 md:h-[500px] md:w-[400px]"
              >
                <div className="flex flex-col gap-3">
                  <QuoteMark />
                  <p className="text-base font-medium leading-relaxed text-charcoal">{r.quote}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex h-[50px] w-[50px] items-center justify-center rounded-[7px] bg-white text-ink"><HouseMark /></span>
                  <div>
                    <p className="h-label text-graphite">{r.attribution}</p>
                    <p className="text-sm text-slate">Published by New Home Agents</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link href="/contact" className="group relative hidden h-[500px] overflow-hidden rounded-[15px] bg-ink text-white lg:block">
          <Image
            src="/images/brand/consultant.jpg"
            alt=""
            fill
            quality={85}
            sizes="400px"
            className="object-cover transition-transform duration-[1200ms] ease-out-soft group-hover:scale-[1.03]"
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="h-sub">Talk to the team</p>
            <p className="mt-1 text-sm text-cloud">Property consultants nationwide, seven days a week</p>
            <p className="mt-3 text-sm underline underline-offset-4">Get in touch →</p>
          </div>
        </Link>
      </div>
    </section>
  );
}

function QuoteMark() {
  return <svg viewBox="0 0 26 21" className="h-6 w-6 text-line" fill="currentColor" aria-hidden="true"><path d="M0 21V12.4C0 5.9 3.7 1.6 10.4 0l1.5 3.1C8.3 4.4 6.4 6.9 6.1 10.3H11V21H0zm15 0V12.4C15 5.9 18.7 1.6 25.4 0l1.5 3.1c-3.6 1.3-5.5 3.8-5.8 7.2H26V21H15z" /></svg>;
}
function HouseMark() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" /></svg>;
}
