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
              <p className="body-sm">{about.copy}</p>
            </Appear>
            <Appear delay={0.4}>
              <Button label={about.cta.label} href={about.cta.href} />
            </Appear>
          </div>
        </div>

        <div className="flex flex-col gap-5 tablet:flex-row">
          {about.stats.map((stat, i) => (
            <Appear key={stat.index} delay={0.5 + i * 0.1} className="flex flex-1">
              <div className="flex w-full flex-col gap-20 plate p-5">
                <p className="caption2 border-b border-ink-200 pb-5">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="h2 flex-1">{stat.value}</p>
                  <p className="caption text-right">{stat.index}</p>
                </div>
              </div>
            </Appear>
          ))}
        </div>
      </div>
    </section>
  );
}
