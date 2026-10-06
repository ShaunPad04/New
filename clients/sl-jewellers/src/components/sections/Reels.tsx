import { INSTAGRAM, REELS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import MagneticButton from "@/components/motion/MagneticButton";
import ReelsCarousel from "@/components/ReelsCarousel";

/** The shop's reels: the 3D carousel (round 4 pick), a follow button and the Instagram link under it. */
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

        <div className="mt-10">
          <ReelsCarousel reels={REELS} instagram={{ url: INSTAGRAM.profileUrl, handle: INSTAGRAM.handle }} />
        </div>
      </div>
    </section>
  );
}
