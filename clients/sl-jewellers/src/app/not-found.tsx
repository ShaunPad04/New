import Link from "next/link";
import { BUSINESS } from "@/lib/content";

export default function NotFound() {
  return (
    <div className="on-black">
      <div className="wrap flex min-h-[70svh] flex-col justify-center py-20">
        <p className="eyebrow">404</p>
        <h1 className="display-l mt-3">That page is not in the case.</h1>
        <p className="mt-5 max-w-[42ch] text-paper/80">
          The link may be old. Everything is on the home page, or ask us directly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-metal">
            Back to the shop
          </Link>
          <Link href="/enquiry" className="btn btn-ghost">
            Make an enquiry
          </Link>
          <a href={`tel:${BUSINESS.phone.e164}`} className="btn btn-ghost">
            Call {BUSINESS.phone.display}
          </a>
        </div>
      </div>
    </div>
  );
}
