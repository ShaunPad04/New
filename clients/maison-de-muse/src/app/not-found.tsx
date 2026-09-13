import Link from "next/link";
import { Cta } from "@/components/cta";

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-[100svh] flex-1 flex-col items-center justify-center px-6 pt-24 text-center"
    >
      <p className="eyebrow mb-8">Page not found</p>
      <h1 className="display-xl text-display-lg max-w-[14ch] text-espresso">
        That page has
        <br />
        <em className="display-italic text-plum">wandered off.</em>
      </h1>
      <p className="lede mt-6 max-w-[40ch]">
        The link may be out of date. The menu, the story and the address are
        all where you left them.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Cta href="/">Back home</Cta>
        <Cta href="/menu" variant="ghost">
          The menu
        </Cta>
      </div>
      <Link href="/visit" className="link-line mt-8 text-sm text-mocha">
        Find us on Sea View Street
      </Link>
    </main>
  );
}
