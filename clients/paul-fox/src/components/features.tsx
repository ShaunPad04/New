import { features } from "@/lib/content";
import { Appear } from "./appear";
import { Button } from "./button";

export function Features() {
  return (
    <section data-dark className="section-lg relative overflow-clip bg-ink-900">
      <img src={features.background} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="container relative flex flex-col gap-10">
        <div className="flex flex-col gap-5 tablet:flex-row tablet:items-end">
          <div className="flex flex-1 flex-col gap-3">
            <Appear>
              <p className="caption2 !text-ink-200">{features.eyebrow}</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2 max-w-[460px] !text-ink-50">{features.heading}</h2>
            </Appear>
          </div>
          <div className="flex flex-1 flex-col gap-5 tablet:max-w-[460px] tablet:items-end">
            <Appear delay={0.2}>
              <p className="body-sm !text-ink-200 tablet:text-right">{features.copy}</p>
            </Appear>
            <Appear delay={0.3}>
              <Button variant="secondary" label={features.cta.label} href={features.cta.href} />
            </Appear>
          </div>
        </div>

        {/* Phone: one tap-to-open row per reason, so six paragraphs don't stack. */}
        <Appear delay={0.4} className="glass flex flex-col rounded-lg tablet:hidden">
          {features.items.map((item, i) => (
            <details key={item.number} className={`group/row ${i < features.items.length - 1 ? "border-b border-glass-border" : ""}`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                <span className="flex items-baseline gap-3">
                  <span className="caption !text-ink-300">{item.number}</span>
                  <span className="h6 !text-ink-50">{item.title}</span>
                </span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] bg-ink-50 text-ink-900" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 ease-[var(--ease-hover)] group-open/row:rotate-45"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </span>
              </summary>
              <p className="body-sm px-4 pb-4 !text-ink-200">{item.description}</p>
            </details>
          ))}
        </Appear>

        <Appear delay={0.4} className="hidden grid-cols-1 gap-2.5 tablet:grid tablet:grid-cols-2 desktop:grid-cols-3">
          {features.items.map((item) => (
            <div key={item.number} className="glass group relative flex h-[213px] flex-col justify-between overflow-clip rounded-lg p-5">
              <div className="absolute inset-0 bg-ink-900 opacity-0 transition-opacity duration-[400ms] ease-[var(--ease-hover)] group-hover:opacity-100" />
              <h5 className="h5 relative !text-ink-50">{item.title}</h5>
              <p className="body-sm relative !text-ink-50 transition-opacity duration-[400ms] ease-[var(--ease-hover)] tablet:opacity-0 tablet:group-hover:opacity-100">
                {item.description}
              </p>
              <p className="caption relative text-right !text-ink-50">{item.number}</p>
            </div>
          ))}
        </Appear>
      </div>
    </section>
  );
}
