import Image from "next/image";
import Link from "next/link";
import { BUSINESS, type Collection } from "@/lib/content";

/** What a category page shows while nothing is listed: its illustrated cover (if it has one)
 *  beside the note that the case changes daily, and the two ways to ask: an enquiry, which opens
 *  on "Sourcing a piece", or a call. */
export default function CategoryEmpty({ c, cover = true }: { c: Collection; cover?: boolean }) {
  return (
    <div className="cx-empty">
      {cover && c.cover && (
        <div className="cx-empty-media">
          <Image src={c.cover} alt="" fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" style={{ objectPosition: c.coverFocus }} />
        </div>
      )}
      <div className="cx-empty-copy">
        <p className="text-paper">The case changes daily.</p>
        <p className="mt-3 text-wall">
          Stock moves faster than a page does, so the surest way to know what is in today is to ask. Tell us what you are after and we will
          say what we have, or call the shop and we will look while you wait.
        </p>
        <div className="cx-empty-actions">
          <Link href="/enquiry?type=bespoke" className="plan-cta">
            <span>Ask what is in</span>
            <span className="plan-disc" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="plan-arrow">
                <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
          <a href={`tel:${BUSINESS.phone.e164}`} className="btn btn-ghost">
            Call {BUSINESS.phone.display}
          </a>
        </div>
      </div>
    </div>
  );
}
