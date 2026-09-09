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

        <Appear delay={0.4} className="grid grid-cols-1 gap-2.5 tablet:grid-cols-2 desktop:grid-cols-3">
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
