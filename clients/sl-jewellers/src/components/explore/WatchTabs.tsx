import { COLLECTIONS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import ShopTabs from "./ShopTabs";

/** Server wrapper for the tabbed shop grid: the four stocked categories, watches first. */
export default function WatchTabs() {
  const cats = ["watches", "chains", "bracelets", "bullion"].map((s) => COLLECTIONS.find((c) => c.slug === s)).filter((c) => c?.pieces?.length) as typeof COLLECTIONS;
  return (
    <section className="on-black section" aria-labelledby="watches-title-c">
      <div className="wrap">
        <ShopTabs
          cats={cats}
          heading={
            <Reveal>
              <p className="eyebrow">Shop the case</p>
              <SplitHeading id="watches-title-c" text={"Watches first,\n*then the rest.*"} className="display-l mt-3" />
            </Reveal>
          }
        />
        <p className="mt-6 text-xs text-wall">Not affiliated with the brands we sell. Stock moves daily; ask before you travel.</p>
      </div>
    </section>
  );
}
