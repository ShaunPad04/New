import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { env } from "../env";
import { SCHEMA } from "./schema";

function resolveDatabaseFile(): string {
  const configured = env.databaseFile;
  // The bundler flags dynamic path joins because they can pull a whole tree
  // into the server bundle. This one is a runtime data path, not a module, so
  // there is nothing to trace.
  return isAbsolute(configured) ? configured : join(/* turbopackIgnore: true */ process.cwd(), configured);
}

/**
 * The connection is cached on `globalThis` so Next's dev-mode module reloading
 * does not leak a new file handle on every request.
 */
const GLOBAL_KEY = Symbol.for("blackline.lead-engine.db");
type GlobalWithDb = typeof globalThis & { [GLOBAL_KEY]?: DatabaseSync };

export function getDb(): DatabaseSync {
  const g = globalThis as GlobalWithDb;
  const existing = g[GLOBAL_KEY];
  if (existing) return existing;

  const file = resolveDatabaseFile();
  mkdirSync(dirname(file), { recursive: true });
  const connection = new DatabaseSync(file);
  connection.exec(SCHEMA);
  g[GLOBAL_KEY] = connection;
  return connection;
}

/** Used by the tests and the migration script; the server never closes the db. */
export function closeDb(): void {
  const g = globalThis as GlobalWithDb;
  const existing = g[GLOBAL_KEY];
  if (!existing) return;
  existing.close();
  delete g[GLOBAL_KEY];
}
