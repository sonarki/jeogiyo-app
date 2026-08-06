#!/usr/bin/env node
// Standalone production server for AI Price Table (VPS deployment).
// Zero dependencies: serves the static build from public/ and the metered
// JSON API at /api/tools with Gumroad license verification.
// Completely self-contained — shares nothing with any other service on the VPS.

import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, normalize, extname } from "node:path";

const PORT = Number(process.env.PORT || 8080);
const ROOT = process.env.SITE_ROOT || join(process.cwd(), "public");
const DATA = JSON.parse(readFileSync(join(process.cwd(), "data", "tools.json"), "utf8"));
const GUMROAD_PRODUCT_ID = process.env.GUMROAD_PRODUCT_ID || "";
const FREE_LIMIT = Number(process.env.FREE_LIMIT || 100);

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon",
};

// ---- API: free tier rate limit + Gumroad Pro keys ----
const hits = new Map();     // ip  -> { count, day }
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
        product_id: GUMROAD_PRODUCT_ID, license_key: key, increment_uses_count: "false",
      }),
    });
    if (res.ok) {
      const body = await res.json();
      const p = body.purchase || {};
      ok = body.success === true && !p.refunded && !p.chargebacked &&
        !p.subscription_ended_at && !p.subscription_cancelled_at && !p.subscription_failed_at;
    }
  } catch {
    ok = cached ? cached.ok : false; // Gumroad unreachable -> last known state
  }
  keyCache.set(key, { ok, day: d });
  return ok;
}

async function apiTools(req, res, url) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const key = req.headers["x-api-key"];
  const paid = await verifyGumroadKey(key);
  if (!paid) {
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "anon").split(",")[0].trim();
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
  const cat = url.searchParams.get("cat");
  const tools = cat ? DATA.tools.filter((t) => t.category === cat) : DATA.tools;
  res.end(JSON.stringify({ updated: DATA.meta.updated, tier: paid ? "pro" : "free", count: tools.length, tools }));
}

// ---- static files ----
function serveStatic(res, urlPath) {
  let rel = normalize(decodeURIComponent(urlPath)).replace(/^([/\\.])+/, "");
  if (rel === "" || rel.endsWith("/")) rel += "index.html";
  let file = join(ROOT, rel);
  if (!existsSync(file) && existsSync(file + ".html")) file += ".html";
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) || !statSync(file).isFile()) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    return res.end("Not found");
  }
  const ext = extname(file);
  res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
  // Static build changes at most daily; let Cloudflare and browsers cache it.
  res.setHeader("Cache-Control", ext === ".html" ? "public, max-age=3600" : "public, max-age=86400");
  res.end(readFileSync(file));
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname === "/api/tools") return await apiTools(req, res, url);
    if (url.pathname === "/healthz") { res.setHeader("Content-Type", "text/plain"); return res.end("ok"); }
    return serveStatic(res, url.pathname);
  } catch (e) {
    res.statusCode = 500;
    res.end("Internal error");
    console.error(e);
  }
}).listen(PORT, () => console.log(`AI Price Table serving ${ROOT} on :${PORT}`));
