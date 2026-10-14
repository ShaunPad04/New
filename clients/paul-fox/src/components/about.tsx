import { about } from "@/lib/content";
import { Appear } from "./appear";
import { Button } from "./button";

export function About() {
  return (
    <section className="section">
      <div className="container flex flex-col gap-10">
        <div className="flex flex-col gap-5 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <Appear>
              <p className="caption2">{about.eyebrow}</p>
            </Appear>
            <Appear delay={0.1}>
              <img
                src={about.image.src}
                alt={about.image.alt}
                width={473}
                height={234}
                className="h-[234px] w-full max-w-[473px] rounded-lg object-cover object-top"
              />
            </Appear>
          </div>
          <div className="flex flex-1 flex-col gap-5 tablet:max-w-[460px]">
            <Appear delay={0.2}>
              <h2 className="h2">{about.heading}</h2>
            </Appear>
            <Appear delay={0.3}>
              <p className="body-sm tablet:hidden">{about.short}</p>
              <p className="body-sm hidden tablet:block">{about.copy}</p>
            </Appear>
            <Appear delay={0.4}>
              <Button label={about.cta.label} href={about.cta.href} />
            </Appear>
          </div>
        </div>

        {/* Three tight tiles in a row on a phone; the tall plates only from tablet up. */}
        <div className="grid grid-cols-3 gap-2.5 tablet:flex tablet:gap-5">
          {about.stats.map((stat, i) => (
            <Appear key={stat.index} delay={0.5 + i * 0.1} className="flex flex-1">
              <div className="flex w-full flex-col gap-4 plate p-3 tablet:gap-20 tablet:p-5">
                <p className="caption2 border-b border-ink-200 pb-3 tablet:pb-5">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="h4 flex-1 tablet:!text-[38px] desktop:!text-[48px]">{stat.value}</p>
                  <p className="caption hidden text-right tablet:block">{stat.index}</p>
                </div>
              </div>
            </Appear>
          ))}
        </div>
      </div>
    </section>
  );
}
