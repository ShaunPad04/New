import Link from "next/link";
import { LAUNCH, SERVICES } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * "Bring it in. Get a price." One row of equal cards divided by hairlines:
 * title, a short lead, a labelled list and a full-width action at the foot,
 * all four bottom-aligned however long the lists are. Layout only; every word
 * is S&L's own from content/services.json.
 */
export default function Services() {
  return (
    <section id="services" className="on-black section" aria-labelledby="services-title">
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Sell it, swap it, get it sent</p>
            <SplitHeading id="services-title" text={"Bring it in.\n*Get a price.*"} className="display-l mt-3" />
          </div>
          <p className="max-w-[46ch] text-paper/75">
            Chains, rings, odd earrings, old sovereigns, the lot. Anything gold or silver goes on the scale in front of you and you get a price while you wait.
          </p>
        </Reveal>

        <Reveal group className="plans mt-12">
          {SERVICES.map((s) => (
            <article key={s.slug} className="plan">
              <h3 className="plan-title">{s.title}</h3>
              <p className="plan-lead">{s.lead}</p>

              {s.points.length > 0 && (
                <>
                  <p className="plan-label">What you get</p>
                  <ul className="plan-list">
                    {s.points.map((pt) => (
                      <li key={pt}>
                        <svg className="plan-tick" viewBox="0 0 20 20" aria-hidden="true">
                          <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {!LAUNCH && s.todo && <span className="todo plan-todo">{s.todo}</span>}

              <Link href={`/enquiry?type=${s.enquiryType}&item=${encodeURIComponent(s.title)}`} className="plan-cta">
                <span>{s.cta}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true" className="plan-arrow">
                  <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">: {s.title}</span>
              </Link>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
