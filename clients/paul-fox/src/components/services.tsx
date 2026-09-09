import { services } from "@/lib/content";
import { asset } from "@/lib/assets";
import { Appear } from "./appear";
import { Button } from "./button";

export function Services() {
  return (
    <section className="section">
      <div className="container flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <Appear>
            <p className="caption2">{services.eyebrow}</p>
          </Appear>
          <Appear delay={0.1}>
            <h2 className="h2">{services.heading}</h2>
          </Appear>
        </div>

        {/* Each card is sticky at top 100px so they stack over one another while scrolling. */}
        <div className="flex flex-col gap-5">
          {services.items.map((item, i) => {
            const last = i === services.items.length - 1;
            const sticky = `sticky ${last ? "top-[120px] tablet:top-[100px]" : "top-[100px]"}`;
            const card = (
              <a href={item.href} className="flex flex-col gap-5 tablet:h-[500px] tablet:flex-row">
                <img
                  src={asset(item.image)}
                  alt=""
                  loading="lazy"
                  className="h-[260px] w-full rounded-lg object-cover tablet:h-full tablet:w-1/2 tablet:flex-1"
                />
                <div className="flex flex-1 flex-col items-start rounded-lg bg-ink-50 p-5 tablet:h-full">
                  <div className="w-full border-t border-ink-200" />
                  <p className="mono mt-[9px] w-full text-right text-[14px] text-ink-300">{item.counter}</p>
                  <p className="body-sm !text-ink-300">{item.label}</p>
                  <h3 className="h3 mt-2">{item.title}</h3>
                  <div className="flex flex-1 items-center py-5">
                    <p className="body-sm">{item.description}</p>
                  </div>
                  <Button as="span" variant="secondary" label={item.button} />
                </div>
              </a>
            );
            return i === 0 ? (
              <Appear key={item.title} delay={0.2} className={sticky}>
                {card}
              </Appear>
            ) : (
              <div key={item.title} className={sticky}>
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
