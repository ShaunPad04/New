import { hero } from "@/lib/content";
import { Appear } from "./appear";

export function Hero() {
  return (
    <section data-dark className="relative h-[600px] overflow-clip bg-ink-900 tablet:h-[95vh]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={hero.video}
        poster={hero.poster}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="dark-strip absolute inset-x-0 bottom-0 h-[105px]" />
      <div className="container absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 pb-8 tablet:items-end">
        <Appear onMount className="w-full">
          <h1 className="wordmark w-full">
            <span className="sr-only">{hero.title} — </span>
            {hero.wordmark}
          </h1>
        </Appear>
        <Appear onMount delay={0.2}>
          <p className="caption2 max-w-[460px] !text-ink-200">{hero.copy}</p>
        </Appear>
      </div>
    </section>
  );
}
