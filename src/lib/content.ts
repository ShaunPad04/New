import { readFileSync } from "node:fs";
import { join } from "node:path";

const CONTENT_DIR = join(process.cwd(), "src", "content");

/**
 * Read a route's rendered `<main>` markup. The markup was reconstructed from
 * the client's built export: image tokens resolved to /images/zen/* and all
 * internal links rewritten to real paths. It is trusted, first-party content,
 * so rendering it with dangerouslySetInnerHTML is safe here.
 */
export function pageHtml(slug: string): string {
  return readFileSync(join(CONTENT_DIR, "pages", `${slug}.html`), "utf8");
}

export function shellHtml(part: "header" | "footer"): string {
  return readFileSync(join(CONTENT_DIR, "shell", `${part}.html`), "utf8");
}
