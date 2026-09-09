import { team } from "@/lib/content";
import { asset } from "@/lib/assets";
import { Appear } from "./appear";
import { MapPin } from "./icons";

export function Team() {
  const n = team.members.length;
  const duration = (n * (team.cardWidth + team.gap)) / team.velocity;
  const cards = [...team.members, ...team.members];

  return (
    <section data-dark className="section-lg relative overflow-clip bg-ink-900">
      <img src={team.background} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="container relative flex flex-col gap-10">
        <div className="flex flex-col gap-5 tablet:flex-row">
          <div className="flex-1">
            <Appear>
              <p className="caption2 !text-ink-50">{team.eyebrow}</p>
            </Appear>
          </div>
          <div className="flex flex-col gap-5 tablet:w-[460px]">
            <Appear delay={0.1}>
              <h2 className="h2 !text-ink-50">{team.heading}</h2>
            </Appear>
            <Appear delay={0.2}>
              <p className="body-sm !text-ink-200">{team.copy}</p>
            </Appear>
          </div>
        </div>

        <Appear delay={0.3} className="ticker overflow-clip rounded-[10px]">
          {/* Gap is a margin on every card (not flex gap) so the loop seam is exactly one gap wide. */}
          <div className="ticker-track" style={{ "--ticker-duration": `${duration}s` } as React.CSSProperties}>
            {cards.map((m, i) => (
              <div
                key={`${m.number}-${i}`}
                className="glass group relative shrink-0 overflow-clip rounded-lg"
                style={{ width: team.cardWidth, height: 352, marginRight: team.gap }}
                aria-hidden={i >= n}
              >
                {/* Not lazy: the photo is opacity-0 until hover and must be decoded before the fade begins. */}
                <img
                  src={asset(m.image)}
                  alt=""
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[400ms] ease-[var(--ease-hover)] group-hover:opacity-100"
                />
                <div className="hover-strip absolute inset-x-0 bottom-0 h-[54px] opacity-0 transition-opacity duration-[400ms] ease-[var(--ease-hover)] group-hover:opacity-100" />
                <div className="absolute inset-5 flex flex-col justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="caption !text-ink-200">{m.number}</p>
                    <h4 className="h4 !text-ink-50">{m.name}</h4>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="caption flex-1 !text-ink-50">{m.post}</p>
                    <MapPin size={14} className="shrink-0 text-ink-50" />
                    <p className="caption !text-ink-50">{m.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Appear>
      </div>
    </section>
  );
}
