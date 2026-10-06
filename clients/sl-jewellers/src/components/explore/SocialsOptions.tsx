import type { ReactNode } from "react";
import { INSTAGRAM, REELS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import MagneticButton from "@/components/motion/MagneticButton";
import ReelPlayer from "@/components/ReelPlayer";
import ReelsCarousel from "./ReelsCarousel";
import ReelsWall from "./ReelsWall";

/** Round 4, socials: the same heading and follow button around three ways to show the reels. */
function Frame({ dir, children }: { dir: string; children: ReactNode }) {
  return (
    <section className="on-black section" aria-labelledby={`reels-title-${dir}`}>
      <div className="wrap">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">On the socials</p>
            <SplitHeading id={`reels-title-${dir}`} text={"Straight off\n*the counter.*"} className="display-l mt-3" />
          </div>
          <MagneticButton className="self-start md:self-auto">
            <a href={INSTAGRAM.profileUrl} target="_blank" rel="noopener" className="btn btn-metal">
              Follow @{INSTAGRAM.handle}
            </a>
          </MagneticButton>
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export const SocialsA = () => (
  <Frame dir="a">
    <ReelsCarousel reels={REELS} />
  </Frame>
);
export const SocialsB = () => (
  <Frame dir="b">
    <ReelsWall reels={REELS} />
  </Frame>
);
export const SocialsC = () => (
  <Frame dir="c">
    <ReelPlayer reels={REELS} />
  </Frame>
);
