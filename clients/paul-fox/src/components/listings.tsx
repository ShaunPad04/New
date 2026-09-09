import { listings } from "@/lib/content";
import { asset } from "@/lib/assets";
import { Appear } from "./appear";
import { Button } from "./button";

export function Listings() {
  return (
    <section className="section">
      <div className="container flex flex-col gap-10">
        <div className="flex items-end justify-between gap-5">
          <div className="flex flex-col gap-3">
            <Appear>
              <p className="caption2">{listings.eyebrow}</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">{listings.heading}</h2>
            </Appear>
          </div>
          <Appear delay={0.2}>
            <Button label={listings.cta.label} href={listings.cta.href} />
          </Appear>
        </div>

        <Appear delay={0.3} className="grid grid-cols-1 gap-5 tablet:grid-cols-2">
          {listings.items.map((item) => (
            <a key={item.slug} href={`/property/${item.slug}`} className="group flex flex-col gap-2">
              <div className="relative aspect-[1.24] overflow-clip rounded-lg bg-ink-50">
                <img
                  src={asset(item.image)}
                  alt={item.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="hover-strip absolute inset-x-0 bottom-0 flex items-center justify-between p-5 opacity-0 transition-opacity duration-[400ms] ease-[var(--ease-hover)] group-hover:opacity-100">
                  <span className="body-sm rounded-[4px] bg-ink-50 px-2 py-1 !text-ink-900">{item.category}</span>
                  <Button as="span" variant="icon" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-ink-50 px-5 py-2">
                <h5 className="h5">{item.name}</h5>
                <span className="caption">{item.number}</span>
              </div>
              <div className="px-5">
                {item.specs.map((spec, i) => (
                  <div
                    key={spec.key}
                    className={`flex items-center justify-between pt-1 pb-2 ${i < item.specs.length - 1 ? "border-b border-ink-200" : ""}`}
                  >
                    <span className="caption2">{spec.key}</span>
                    <span className="body-sm !text-ink-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </a>
          ))}
        </Appear>
      </div>
    </section>
  );
}
