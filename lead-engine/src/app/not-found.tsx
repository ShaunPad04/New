import Link from "next/link";
import { Eyebrow } from "@/components/primitives";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Eyebrow>404</Eyebrow>
      <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Nothing here</h1>
      <p className="max-w-md text-sm leading-relaxed text-ink-700">
        That lead may have been removed, or the link is wrong.
      </p>
      <Link
        href="/leads"
        className="rounded-full border border-ink-400 px-4 py-2 text-sm text-ink-800 transition-colors hover:border-ink-500 hover:text-ink-1000"
      >
        Back to the lead database
      </Link>
    </div>
  );
}
