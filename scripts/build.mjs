#!/usr/bin/env node
// Static site generator for AIPriceIndex.
// Reads data/tools.json and produces a full programmatic site into /public.
// ONE template here -> thousands of pages. Design is solved once, forever.

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public");
const data = JSON.parse(readFileSync(join(ROOT, "data", "tools.json"), "utf8"));
const { meta, categories, tools } = data;

// ---------- helpers ----------
const catName = (slug) => categories.find((c) => c.slug === slug)?.name ?? slug;
const money = (n) => (n === 0 ? "Free" : `$${n}`);
const byCat = (slug) => tools.filter((t) => t.category === slug);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function write(rel, html) {
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// ---------- shared shell (the ONE template) ----------
function page({ title, description, canonical, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}"/>
<link rel="canonical" href="https://${meta.domain}/${canonical}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<link rel="stylesheet" href="/style.css"/>
</head>
<body>
<header class="site">
  <a class="brand" href="/">⚡ ${esc(meta.site_name)}</a>
  <nav>${categories.map((c) => `<a href="/category/${c.slug}/">${esc(c.name)}</a>`).join("")}
    <a class="api" href="/api-docs/">API</a></nav>
</header>
<main>${body}</main>
<footer class="site">
  <p>${esc(meta.site_name)} — ${esc(meta.tagline)}. Prices last synced ${esc(meta.updated)}.</p>
  <p class="disclaimer">Pricing is auto-collected and may lag vendor changes. Verify on the vendor site before purchase. Some links are affiliate links.</p>
</footer>
</body>
</html>`;
}

function priceRow(t) {
  const p = t.pricing;
  const cta = t.affiliate_url
    ? `<a class="cta" rel="sponsored nofollow" href="${esc(t.affiliate_url)}">Try →</a>`
    : `<a class="cta" rel="nofollow" href="${esc(t.website)}">Site →</a>`;
  return `<tr>
    <td><a href="/tool/${t.slug}/"><strong>${esc(t.name)}</strong></a><br><span class="vendor">${esc(t.vendor)}</span></td>
    <td>${money(p.input)}</td><td>${money(p.output)}</td>
    <td>${esc(p.unit)}</td>
    <td>${p.free_tier ? "✅" : "—"}</td>
    <td>${cta}</td>
  </tr>`;
}

function priceTable(list) {
  return `<div class="tablewrap"><table>
  <thead><tr><th>Model</th><th>Input</th><th>Output</th><th>Unit</th><th>Free tier</th><th></th></tr></thead>
  <tbody>${list.map(priceRow).join("")}</tbody></table></div>`;
}

// ---------- 1. home ----------
write("index.html", page({
  title: `${meta.site_name} — Live AI Model Prices & Specs`,
  description: `Compare pricing and specs for ${tools.length}+ AI models across LLM, image, video and audio. Updated ${meta.updated}.`,
  canonical: "",
  body: `<section class="hero"><h1>${esc(meta.tagline)}</h1>
  <p>Live pricing & specs for <strong>${tools.length}</strong> AI models. Updated daily. Free API available.</p></section>
  ${categories.map((c) => `<section><h2 id="${c.slug}">${esc(c.name)}</h2><p class="blurb">${esc(c.blurb)}</p>${priceTable(byCat(c.slug))}</section>`).join("")}`,
}));

// ---------- 2. category pages ----------
for (const c of categories) {
  write(`category/${c.slug}/index.html`, page({
    title: `${c.name} — AI Model Prices Compared | ${meta.site_name}`,
    description: `${c.blurb} Compare ${byCat(c.slug).length} models by price and spec.`,
    canonical: `category/${c.slug}/`,
    body: `<section><h1>${esc(c.name)} — Price Comparison</h1><p class="blurb">${esc(c.blurb)}</p>${priceTable(byCat(c.slug))}</section>`,
  }));
}

// ---------- 3. per-tool pages ----------
for (const t of tools) {
  const p = t.pricing;
  const specs = Object.entries(t.specs).map(([k, v]) =>
    `<tr><th>${esc(k.replace(/_/g, " "))}</th><td>${esc(Array.isArray(v) ? v.join(", ") : v)}</td></tr>`).join("");
  const cta = t.affiliate_url
    ? `<a class="cta big" rel="sponsored nofollow" href="${esc(t.affiliate_url)}">Get ${esc(t.name)} →</a>`
    : `<a class="cta big" rel="nofollow" href="${esc(t.website)}">Visit ${esc(t.vendor)} →</a>`;
  write(`tool/${t.slug}/index.html`, page({
    title: `${t.name} Pricing & Specs (${meta.updated}) | ${meta.site_name}`,
    description: `${t.name} by ${t.vendor}: ${money(p.input)} input / ${money(p.output)} output ${p.unit}. Full specs and alternatives.`,
    canonical: `tool/${t.slug}/`,
    body: `<article><nav class="crumb"><a href="/">Home</a> / <a href="/category/${t.category}/">${esc(catName(t.category))}</a> / ${esc(t.name)}</nav>
    <h1>${esc(t.name)}</h1><p class="vendor">by ${esc(t.vendor)}</p>
    <div class="pricebox"><div><span class="label">Input</span><span class="num">${money(p.input)}</span></div>
    <div><span class="label">Output</span><span class="num">${money(p.output)}</span></div>
    <div><span class="label">Unit</span><span class="num small">${esc(p.unit)}</span></div></div>
    ${cta}
    <h2>Specs</h2><div class="tablewrap"><table class="specs"><tbody>${specs}</tbody></table></div>
    <h2>Alternatives in ${esc(catName(t.category))}</h2>
    ${priceTable(byCat(t.category).filter((x) => x.slug !== t.slug))}</article>`,
  }));
}

// ---------- 4. api docs ----------
write("api-docs/index.html", page({
  title: `API — ${meta.site_name}`,
  description: `Free and paid JSON API for live AI model pricing.`,
  canonical: "api-docs/",
  body: `<section><h1>Pricing API</h1>
  <p>Get live AI model pricing as JSON. Free tier: 100 req/day. Paid tier: unmetered + webhooks.</p>
  <pre><code>GET /api/tools           # all models
GET /api/tools?cat=llm   # filter by category
Header: x-api-key: YOUR_KEY   # required for paid tier</code></pre>
  <p>The static export at <code>/api/tools.json</code> is always free. The metered endpoint and Stripe checkout are wired in <code>/api/tools.js</code>.</p>
  <a class="cta big" href="/pricing/">See API plans →</a></section>`,
}));

// ---------- 5. pricing (Stripe placeholder) ----------
write("pricing/index.html", page({
  title: `API Plans — ${meta.site_name}`,
  description: `Simple monthly plans for the AI pricing API.`,
  canonical: "pricing/",
  body: `<section><h1>API Plans</h1><div class="plans">
  <div class="plan"><h3>Free</h3><p class="price">$0</p><ul><li>100 req/day</li><li>Daily-updated data</li></ul></div>
  <div class="plan featured"><h3>Pro</h3><p class="price">$29<span>/mo</span></p><ul><li>Unmetered API</li><li>Price-change webhooks</li><li>CSV export</li></ul>
  <a class="cta big" href="STRIPE_PAYMENT_LINK">Subscribe</a></div>
  <div class="plan"><h3>Business</h3><p class="price">$99<span>/mo</span></p><ul><li>Everything in Pro</li><li>Historical price data</li><li>Priority support</li></ul>
  <a class="cta big" href="STRIPE_PAYMENT_LINK_BUSINESS">Subscribe</a></div>
  </div><p class="disclaimer">Replace STRIPE_PAYMENT_LINK with your Stripe Payment Link (dashboard.stripe.com → Payment Links). That link is where your bank account gets connected.</p></section>`,
}));

// ---------- 6. raw JSON API (free static export) ----------
write("api/tools.json", JSON.stringify({ updated: meta.updated, count: tools.length, tools }, null, 2));

// ---------- 7. sitemap + robots ----------
const urls = ["", "api-docs/", "pricing/", ...categories.map((c) => `category/${c.slug}/`), ...tools.map((t) => `tool/${t.slug}/`)];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>https://${meta.domain}/${u}</loc></url>`).join("\n")}
</urlset>`);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: https://${meta.domain}/sitemap.xml\n`);

// ---------- copy static assets ----------
const assets = join(ROOT, "assets", "style.css");
if (existsSync(assets)) cpSync(assets, join(OUT, "style.css"));

console.log(`Built ${urls.length} pages -> /public  (${tools.length} models, ${categories.length} categories)`);
