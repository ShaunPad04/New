/**
 * Creates the database file and applies the schema. Safe to run repeatedly.
 * The app does this on first connection too; this exists for deployments that
 * want the database in place before the first request.
 */
import { closeDb, getDb } from "../src/lib/db/index.ts";
import { env } from "../src/lib/env.ts";

const db = getDb();
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
  .all() as { name: string }[];

console.log(`Database ready at ${env.databaseFile}`);
console.log(`Tables: ${tables.map((t) => t.name).join(", ")}`);
closeDb();
