#!/usr/bin/env node
/**
 * Preview server management script.
 * Usage: node scripts/preview.mjs [start|stop|restart]
 */
const action = process.argv[2];

if (!action || !["start", "stop", "restart"].includes(action)) {
  console.error("Usage: node scripts/preview.mjs [start|stop|restart]");
  process.exit(2);
}

console.log(`[preview] Action: ${action} — no-op in this environment.`);
process.exit(0);
