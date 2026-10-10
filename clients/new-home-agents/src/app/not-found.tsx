import Link from "next/link";
import { Button } from "@/components/button";
import { nav, secondaryNav, site } from "@/lib/content";

export default function NotFound() {
  return (
    <main id="main" className="pt-[140px] pb-20 md:pt-[180px]">
      <div className="container max-w-[720px]">
        <p className="eyebrow">Page not found</p>
        <h1 className="h-page mt-4">We can&rsquo;t find that page</h1>
        <p className="lede mt-4">The property may have been sold or withdrawn, or the address may be wrong. Try a search, or pick a page below.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/properties">Search properties</Button>
          <Button href="/" variant="secondary">Back to the homepage</Button>
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate">
          {[...nav, ...secondaryNav].map((n) => <li key={n.href}><Link href={n.href} className="hover:text-ink">{n.label}</Link></li>)}
        </ul>
        <p className="mt-8 text-sm text-slate">Or call {site.name} on <a className="text-ink underline" href={site.phoneHref}>{site.phone}</a>.</p>
      </div>
    </main>
  );
}
