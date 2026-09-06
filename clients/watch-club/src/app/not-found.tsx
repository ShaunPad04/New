import Link from "next/link";
import { business } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-obsidian px-5">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-6">404</p>
        <h1 className="display-lg text-bone">This page has stopped.</h1>
        <p className="mt-6 text-sm leading-relaxed text-bone-muted">
          The page you were looking for is not here. The shop, however, is open{" "}
          {business.hours.toLowerCase()}.
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex items-center gap-3 rounded-full bg-bone py-2 pl-6 pr-2 text-sm font-medium text-obsidian transition-colors duration-300 hover:bg-white"
        >
          Back to the collection
          <span className="grid size-9 place-items-center rounded-full bg-obsidian text-bone">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 11L11 3M11 3H4.5M11 3v6.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </main>
  );
}
