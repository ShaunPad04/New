import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { upload } from "@/lib/assets";
import { blogPosts, getPost } from "@/lib/pages-data";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { Prose } from "@/components/prose";
import { CtaBand } from "@/components/cta-band";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt.slice(0, 160), openGraph: { images: [{ url: upload(p.image) }] } };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const more = blogPosts.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <main>
      <article className="section">
        <div className="container flex flex-col gap-10">
          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-5">
            <Appear onMount>
              <p className="caption2">[ BLOG ]</p>
            </Appear>
            <Appear onMount delay={0.1}>
              <h1 className="h1">{p.title}</h1>
            </Appear>
          </div>
          <Appear onMount delay={0.2}>
            <img src={upload(p.image)} alt="" className="aspect-[2/1] w-full rounded-lg object-cover" fetchPriority="high" />
          </Appear>
          <Appear onMount delay={0.3} className="mx-auto w-full max-w-[760px]">
            <Prose blocks={p.blocks} />
            {p.truncated && (
              <p className="caption mt-6 plate p-4">
                This article continues on{" "}
                <a href={p.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  paul-fox.com
                </a>
                .
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Button label="Book a free valuation" href="/valuation-request" />
              <Button label="All posts" href="/blog" variant="secondary" />
            </div>
          </Appear>
        </div>
      </article>

      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Appear>
              <p className="caption2">[ MORE FROM THE BLOG ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">keep reading</h2>
            </Appear>
          </div>
          <Appear delay={0.2} className="grid grid-cols-1 gap-5 tablet:grid-cols-3">
            {more.map((x) => (
              <a key={x.slug} href={`/blog/${x.slug}`} className="group flex flex-col gap-2">
                <div className="relative aspect-[1.5] overflow-clip plate">
                  <img src={upload(x.image)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-[var(--ease-hover)] group-hover:scale-[1.03]" />
                </div>
                <h3 className="h6 plate p-5">{x.title}</h3>
              </a>
            ))}
          </Appear>
        </div>
      </section>
      <CtaBand eyebrow="[ THINKING OF MOVING? ]" title="book a free valuation" ctas={[{ label: "Book a free valuation", href: "/valuation-request" }]} />
    </main>
  );
}
