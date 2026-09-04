import type { Metadata } from "next";
import { pageHtml } from "@/lib/content";
import { routeMeta } from "@/lib/site";

const meta = routeMeta("/reviews")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.route },
  openGraph: { title: meta.title, description: meta.description, url: meta.route },
};

export default function Page() {
  return (
    <div
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: pageHtml("reviews") }}
    />
  );
}
