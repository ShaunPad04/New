import Link from "next/link";
import Image from "next/image";
import { FAQ, LAUNCH } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Parallax from "@/components/motion/Parallax";

/** `as="h1"` when this is the whole page rather than a section of one. */
export default function Faq({ as = "h2" }: { as?: "h1" | "h2" } = {}) {
  const half = Math.ceil(FAQ.length / 2);
  const cols = [FAQ.slice(0, half), FAQ.slice(half)];
  return (
    <section id="faq" className="on-charcoal section faq" aria-labelledby="faq-title">
      <div className="wrap">
        <Reveal className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">Before you spend a penny</p>
            <SplitHeading as={as} id="faq-title" text={"Questions,\n*answered.*"} className="display-l mt-3" />
            <Link href="/enquiry" className="btn btn-ghost btn-sm mt-5">
              Ask the guys
            </Link>
          </div>
          <div className="tray hidden w-56 md:block">
            <Parallax className="relative aspect-square" strength={20}>
              <Image src="/images/pieces/chains/53-efa00535.jpg" alt="" fill sizes="224px" className="object-cover" loading="lazy" />
            </Parallax>
          </div>
        </Reveal>

        <Reveal group className="mt-10 grid gap-x-12 md:grid-cols-2">
          {cols.map((col, ci) => (
            <div key={ci}>
              {col.map((f, i) => {
                const n = ci * half + i + 1;
                return (
                  <details key={f.q} name="faq">
                    <summary>
                      <span className="n" aria-hidden="true">
                        {String(n).padStart(2, "0")}
                      </span>
                      <span>{f.q}</span>
                      <span className="plus" aria-hidden="true" />
                    </summary>
                    <div className="panel">
                      <div>
                        <p>{f.a}</p>
                        {f.todo && !LAUNCH && (
                          <p className="!pt-0">
                            <span className="todo">{f.todo}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
