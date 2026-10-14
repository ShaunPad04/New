import { INSTAGRAM, REELS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import ReelsCarousel from "@/components/ReelsCarousel";

/**
 * The shop's reels: a centred heading over the 3D carousel (round 4 pick), with the
 * Instagram link centred under it. No separate follow button (Shaun, 6 Oct 2026: the
 * Instagram link already does that job).
 */
export default function Reels() {
  return (
    <section id="reels" className="on-black section" aria-labelledby="reels-title">
      <div className="wrap">
        <Reveal className="text-center">
          <p className="eyebrow">On the socials</p>
          <SplitHeading id="reels-title" text={"Straight off\n*the counter.*"} className="display-l mt-3" />
        </Reveal>

        <div className="mt-10">
          <ReelsCarousel reels={REELS} instagram={{ url: INSTAGRAM.profileUrl, handle: INSTAGRAM.handle }} />
        </div>
      </div>
    </section>
  );
}
