import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Next resolves extensionless relative imports through its bundler. Plain Node
 * ESM does not, so this hook appends `.ts`/`.tsx` when the bare specifier does
 * not resolve. It exists only so `node --test` can run the source directly,
 * without a build step and without littering the app code with extensions.
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)) {
    for (const suffix of [".ts", ".tsx", "/index.ts"]) {
      const candidate = new URL(specifier + suffix, context.parentURL);
      if (existsSync(fileURLToPath(candidate))) {
        return nextResolve(specifier + suffix, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
