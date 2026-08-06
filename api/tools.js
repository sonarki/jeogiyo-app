// Metered JSON API (Vercel-style serverless function).
// Free tier: rate-limited by IP. Paid tier: valid x-api-key from Stripe subscribers.
// Runtime AI cost of this endpoint = $0. It only serves pre-built JSON.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const DATA = JSON.parse(readFileSync(join(process.cwd(), "data", "tools.json"), "utf8"));

// In production, back these with a KV store / DB. Kept in-memory for the skeleton.
const hits = new Map();                       // ip -> {count, day}
const PAID_KEYS = new Set(                     // fill from Stripe webhook -> your store
  (process.env.PAID_API_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean),
);
const FREE_LIMIT = 100;

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const key = req.headers["x-api-key"];
  const paid = key && PAID_KEYS.has(key);

  if (!paid) {
    const ip = (req.headers["x-forwarded-for"] || "anon").split(",")[0];
    const rec = hits.get(ip);
    const d = today();
    if (!rec || rec.day !== d) hits.set(ip, { count: 1, day: d });
    else if (rec.count >= FREE_LIMIT) {
      res.statusCode = 429;
      return res.end(JSON.stringify({ error: "Free limit reached (100/day). Upgrade at /pricing/", upgrade: "/pricing/" }));
    } else rec.count++;
  }

  const cat = req.query?.cat;
  const tools = cat ? DATA.tools.filter((t) => t.category === cat) : DATA.tools;
  res.end(JSON.stringify({ updated: DATA.meta.updated, tier: paid ? "pro" : "free", count: tools.length, tools }));
}
