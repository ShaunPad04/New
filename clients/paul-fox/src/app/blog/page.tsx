import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { blogPage } from "@/lib/pages";
import { blogPosts } from "@/lib/pages-data";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Blog",
  description: blogPage.copy,
};

export default function BlogIndex() {
  return (
    <main>
      <PageHeader eyebrow={blogPage.eyebrow} title={blogPage.title} copy={blogPage.copy} image={upload(blogPosts[0].image)} compact />
      <section className="section">
        <div className="container grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
          {blogPosts.map((p, i) => (
            <Appear key={p.slug} delay={(i % 3) * 0.1}>
              <a href={`/blog/${p.slug}`} className="group flex h-full flex-col gap-2">
                <div className="relative aspect-[1.5] overflow-clip plate">
                  <img src={upload(p.image)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-[var(--ease-hover)] group-hover:scale-[1.03]" />
                  <div className="hover-strip absolute inset-x-0 bottom-0 flex items-center justify-between p-4 opacity-0 transition-opacity duration-[400ms] ease-[var(--ease-hover)] group-hover:opacity-100">
                    <span className="body-sm rounded-[4px] bg-ink-50 px-2 py-1 !text-ink-900">read</span>
                    <Button as="span" variant="icon" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 plate p-5">
                  <p className="caption2">[ {String(i + 1).padStart(2, "0")} ]</p>
                  <h2 className="h6">{p.title}</h2>
                  <p className="body-sm line-clamp-3">{p.excerpt}</p>
                </div>
              </a>
            </Appear>
          ))}
        </div>
      </section>
      <CtaBand
        eyebrow="[ THINKING OF MOVING? ]"
        title="book a free valuation"
        copy="Advice is free too — call your local branch and ask."
        ctas={[{ label: "Book a free valuation", href: "/valuation-request" }, { label: "Contact us", href: "/contact" }]}
      />
    </main>
  );
}
