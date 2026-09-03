import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-[100svh] flex-1 flex-col items-center justify-center px-6 text-center"
    >
      <p className="eyebrow mb-8">Error 404</p>
      <h1 className="display text-display-lg max-w-[14ch] text-ink-1000">
        This page does not exist.
      </h1>
      <p className="lede mt-6 max-w-[44ch]">
        The link may be out of date, or the page may have moved. Everything else
        is where you left it.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-3 rounded-full bg-ink-1000 px-7 py-4 text-sm font-medium tracking-tight text-ink-0 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-[1.03]"
      >
        Back to the studio
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
