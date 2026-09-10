import { hero } from "@/lib/content";
import { Appear } from "./appear";

export function Hero() {
  return (
    <section data-dark className="relative h-[560px] overflow-clip bg-ink-900 tablet:h-[calc(100vh-68px)]">
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
      <div className="container absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 pb-4 tablet:items-end tablet:pb-8">
        <Appear onMount className="w-full">
          <h1 className="wordmark w-full">
            <span className="sr-only">{hero.title} — </span>
            {hero.wordmark}
          </h1>
        </Appear>
        {/* The slogan is desktop-only: on a phone the name alone carries the hero. */}
        <Appear onMount delay={0.2} className="hidden tablet:block">
          <p className="caption2 max-w-[460px] !text-ink-200">{hero.copy}</p>
        </Appear>
      </div>
    </section>
  );
}
