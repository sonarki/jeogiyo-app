#!/usr/bin/env node
// Daily data refresher. THIS is the only place the product touches AI/network,
// and it runs once a day -> near-zero runtime cost.
//
// Two strategies (pick per source, cheapest first):
//   1. Deterministic fetch+parse of vendor pricing pages (NO AI needed) -> free
//   2. Cheap LLM to normalize messy pages into our schema -> a few cents/day
//
// This skeleton bumps the `updated` date and validates the dataset so the daily
// pipeline is wired end-to-end. Replace the marked block with real collectors.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(ROOT, "data", "tools.json");
const data = JSON.parse(readFileSync(FILE, "utf8"));

// --- validate schema so bad data never ships ---
const required = ["slug", "name", "vendor", "category", "pricing"];
for (const t of data.tools) {
  for (const k of required) if (!(k in t)) throw new Error(`Tool missing "${k}": ${JSON.stringify(t)}`);
  if (typeof t.pricing.input !== "number") throw new Error(`Bad pricing.input for ${t.slug}`);
}
const slugs = new Set();
for (const t of data.tools) {
  if (slugs.has(t.slug)) throw new Error(`Duplicate slug: ${t.slug}`);
  slugs.add(t.slug);
}

// ===================== REAL COLLECTORS GO HERE =====================
// Example (deterministic, no AI):
//   const html = await fetch("https://vendor/pricing").then(r => r.text());
//   const price = parseFloat(html.match(/\$([\d.]+)\s*\/\s*1M input/)?.[1]);
//   const tool = data.tools.find(t => t.slug === "vendor-model");
//   if (price && tool) tool.pricing.input = price;
//
// Example (cheap LLM normalize) — call the cheapest model, not a flagship:
//   const json = await cheapLLM(`Extract {input,output,unit} from: ${html}`);
// ==================================================================

const day = process.env.RUN_DATE || new Date().toISOString().slice(0, 10);
data.meta.updated = day;
for (const t of data.tools) t.updated = t.updated || day;

writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log(`Validated ${data.tools.length} tools. Stamped updated=${day}.`);
