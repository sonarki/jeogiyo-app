// Metered JSON API (Vercel-style serverless function).
// Free tier: rate-limited by IP. Pro tier: a valid Gumroad license key.
// Runtime AI cost of this endpoint = $0. It only serves pre-built JSON.
//
// Pro verification: Gumroad issues a license key on every subscription purchase
// (enable "Generate license keys" on the product). We verify it against
// api.gumroad.com/v2/licenses/verify and cache the result so Gumroad is hit at
// most once per key per day.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const DATA = JSON.parse(readFileSync(join(process.cwd(), "data", "tools.json"), "utf8"));

// Set in the deployment env: the Gumroad product this API is sold under.
const GUMROAD_PRODUCT_ID = process.env.GUMROAD_PRODUCT_ID || "";

const FREE_LIMIT = 100;
const hits = new Map();     // ip  -> { count, day }   (use KV/Redis in production)
const keyCache = new Map(); // key -> { ok, day }

const today = () => new Date().toISOString().slice(0, 10);

async function verifyGumroadKey(key) {
  if (!GUMROAD_PRODUCT_ID || !key) return false;
  const cached = keyCache.get(key);
  const d = today();
  if (cached && cached.day === d) return cached.ok;
  let ok = false;
  try {
    const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        product_id: GUMROAD_PRODUCT_ID,
        license_key: key,
        increment_uses_count: "false",
      }),
    });
    if (res.ok) {
      const body = await res.json();
      const p = body.purchase || {};
      // valid only while the subscription is alive
      ok = body.success === true && !p.refunded && !p.chargebacked &&
        !p.subscription_ended_at && !p.subscription_cancelled_at && !p.subscription_failed_at;
    }
  } catch {
    // Gumroad unreachable: fall back to last known state if we have one
    ok = cached ? cached.ok : false;
  }
  keyCache.set(key, { ok, day: d });
  return ok;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const key = req.headers["x-api-key"];
  const paid = await verifyGumroadKey(key);

  if (!paid) {
    const ip = (req.headers["x-forwarded-for"] || "anon").split(",")[0];
    const rec = hits.get(ip);
    const d = today();
    if (!rec || rec.day !== d) hits.set(ip, { count: 1, day: d });
    else if (rec.count >= FREE_LIMIT) {
      res.statusCode = 429;
      return res.end(JSON.stringify({
        error: `Free limit reached (${FREE_LIMIT}/day). Subscribe for unmetered access.`,
        upgrade: "/api-docs.html",
      }));
    } else rec.count++;
  }

  const cat = req.query?.cat;
  const tools = cat ? DATA.tools.filter((t) => t.category === cat) : DATA.tools;
  res.end(JSON.stringify({ updated: DATA.meta.updated, tier: paid ? "pro" : "free", count: tools.length, tools }));
}
