#!/usr/bin/env node
/**
 * Run database migrations.
 * In the Vercel / production environment, migrations are applied at build time.
 * When no DATABASE_URL is set (e.g. static-only deploys) this is a no-op.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const migrationsDir = join(root, "migrations");

// No-op if DATABASE_URL is not set — this site is currently static-only on Vercel.
if (!process.env.DATABASE_URL) {
  console.log("[migrate] No DATABASE_URL set — skipping migrations.");
  process.exit(0);
}

console.log("[migrate] DATABASE_URL found — would apply migrations from:", migrationsDir);
// Extend this script when a real database is wired up.
process.exit(0);
