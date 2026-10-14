import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * content/about.md as paragraphs. A line starting "## " becomes a sub-heading; HTML
 * comments are dropped, and those starting "TODO:" are returned as badges.
 */
export function readAbout() {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "about.md"), "utf8");
  const todos = [...raw.matchAll(/<!--\s*(TODO:[\s\S]*?)-->/g)].map((m) => m[1].trim());
  const paragraphs = raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { paragraphs, todos };
}
