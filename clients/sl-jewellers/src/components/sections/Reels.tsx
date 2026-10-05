import { INSTAGRAM, REELS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import MagneticButton from "@/components/motion/MagneticButton";
import ReelPlayer from "@/components/ReelPlayer";

/** The shop's reels: one player, one playlist, one follow button. */
export default function Reels() {
  return (
    <section id="reels" className="on-black section" aria-labelledby="reels-title">
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">On the socials</p>
            <SplitHeading id="reels-title" text={"Straight off\n*the counter.*"} className="display-l mt-3" />
          </div>
          <MagneticButton className="self-start md:self-auto">
            <a href={INSTAGRAM.profileUrl} target="_blank" rel="noopener" className="btn btn-metal">
              Follow @{INSTAGRAM.handle}
            </a>
          </MagneticButton>
        </Reveal>

        <Reveal className="mt-10">
          <ReelPlayer reels={REELS} />
        </Reveal>
      </div>
    </section>
  );
}
