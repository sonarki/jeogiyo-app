#!/usr/bin/env node
// Static site generator for AIPriceIndex.
// Reads data/tools.json and produces the full programmatic site into /public.
// ONE template + ONE stylesheet -> every page. Design is solved once, forever.
// All links are RELATIVE so the build works on any host (GitHub Pages subpath,
// Vercel, local file://) without config.

import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public");
const data = JSON.parse(readFileSync(join(ROOT, "data", "tools.json"), "utf8"));
const { meta, categories, tools } = data;
const BASE = `https://${meta.domain}`;

// ---------- helpers ----------
const catName = (slug) => categories.find((c) => c.slug === slug)?.name ?? slug;
const money = (n) => (n == null ? "—" : n === 0 ? "Free" : `$${n}`);
const byCat = (slug) => tools.filter((t) => t.category === slug);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const pages = []; // {rel, html} — rel like "tool/foo.html" or "index.html"

function write(rel, content) {
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

// ---------- shared shell (the ONE template) ----------
// depth 0 = root pages, depth 1 = pages one folder deep (tool/, compare/, category/)
function page({ title, description, rel, body, depth }) {
  const p = "../".repeat(depth);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}"/>
<link rel="canonical" href="${BASE}/${rel === "index.html" ? "" : rel}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<link rel="stylesheet" href="${p}style.css"/>
</head>
<body>
<header class="site"><div class="in">
  <a class="brand" href="${p}index.html">AI Price <b>Table</b></a>
  <nav>
    <a href="${p}index.html">Models</a>
    <a href="${p}compare/index.html">Compare</a>
    <a href="${p}methodology.html">Methodology</a>
    <a class="api" href="${p}api-docs.html">API</a>
  </nav>
</div></header>
<main>${body}</main>
<footer class="site"><div class="in">
  <p><strong>${esc(meta.site_name)}</strong> — ${esc(meta.tagline)}. Prices last verified ${esc(meta.updated)}.</p>
  <p class="disclaimer">Every price is checked against the vendor's official pricing page and dated per row. Pricing may lag vendor changes — verify before purchase. Some outbound links are referral links; they never affect the data. Not affiliated with any vendor.</p>
</div></footer>
</body>
</html>`;
  write(rel, html);
  pages.push(rel);
}

// ---------- table rows ----------
function priceRow(t, depth) {
  const p = "../".repeat(depth);
  const pr = t.pricing;
  const cta = t.affiliate_url
    ? `<a class="cta" rel="sponsored nofollow" href="${esc(t.affiliate_url)}">Try →</a>`
    : `<a class="cta" rel="nofollow" href="${esc(t.website)}">Site →</a>`;
  return `<tr data-name="${esc(`${t.name} ${t.vendor}`.toLowerCase())}" data-cat="${t.category}">
    <td><a href="${p}tool/${t.slug}.html"><strong>${esc(t.name)}</strong></a><br><span class="vendor">${esc(t.vendor)}</span></td>
    <td><span class="tag">${esc(catName(t.category))}</span></td>
    <td class="num">${money(pr.input)}</td><td class="num">${money(pr.output)}</td>
    <td class="num" style="color:var(--dim)">${esc(pr.unit)}</td>
    <td class="num">${esc(t.specs.context_window)}</td>
    <td>${pr.free_tier ? '<span class="free">Yes</span>' : '<span style="color:var(--dim)">—</span>'}</td>
    <td>${cta}</td>
  </tr>`;
}
const HEAD = `<thead><tr><th>Model</th><th>Category</th><th>Input</th><th>Output</th><th>Unit</th><th>Context</th><th>Free tier</th><th></th></tr></thead>`;
const priceTable = (list, depth, id = "") =>
  `<div class="tablewrap"><table${id ? ` id="${id}"` : ""}>${HEAD}<tbody>${list.map((t) => priceRow(t, depth)).join("")}</tbody></table></div>`;

// ---------- vs pairs (programmatic SEO engine) ----------
function vsPairs() {
  const out = [];
  for (const c of categories) {
    const list = byCat(c.slug).sort((a, b) => a.slug.localeCompare(b.slug));
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) out.push([list[i], list[j]]);
  }
  return out;
}
const pairs = vsPairs();
const vsHref = (a, b, depth) => `${"../".repeat(depth)}compare/${a.slug}-vs-${b.slug}.html`;

// ---------- build ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 1. home — searchable master table
page({
  rel: "index.html", depth: 0,
  title: `${meta.site_name} — Compare Every AI Model's Price (${meta.updated})`,
  description: `Live, daily-verified pricing for ${tools.length}+ AI models across LLM, image, video and audio. Input/output cost, context window and free tiers in one honest table.`,
  body: `
<div class="hero">
  <span class="badge"><span class="dot"></span> Prices verified ${esc(meta.updated)}</span>
  <h1>Every AI model's price.<br>One honest table.</h1>
  <p>${esc(meta.tagline)} — checked daily against official vendor pricing pages. No hype, just numbers with dates on them.</p>
</div>
<div class="controls">
  <input class="search" id="q" type="search" placeholder="Search model or vendor… (claude, gemini, flux)" aria-label="Search models"/>
  <div class="chips" id="chips">
    <button class="chip on" data-cat="all">All</button>
    ${categories.map((c) => `<button class="chip" data-cat="${c.slug}">${esc(c.name)}</button>`).join("")}
  </div>
</div>
${priceTable(tools, 0, "master")}
<h2>Popular head-to-head comparisons</h2>
<div class="linkgrid">
  ${pairs.slice(0, 12).map(([a, b]) => `<a href="${vsHref(a, b, 0)}">${esc(a.name)} vs ${esc(b.name)}</a>`).join("")}
</div>
<p style="margin-top:10px;font-size:14px"><a href="compare/index.html">All ${pairs.length} comparisons →</a></p>
<div class="note" style="margin-top:26px">Need this data inside your app or agent? The daily JSON snapshot is free — <a href="api-docs.html">see the Pricing API</a>.</div>
<script>
const q=document.getElementById('q'),chips=document.getElementById('chips'),
rows=[...document.querySelectorAll('#master tbody tr')];let cat='all';
function apply(){const s=q.value.trim().toLowerCase();
rows.forEach(r=>{r.style.display=((!s||r.dataset.name.includes(s))&&(cat==='all'||r.dataset.cat===cat))?'':'none';});}
q.addEventListener('input',apply);
chips.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;
chips.querySelectorAll('.chip').forEach(c=>c.classList.remove('on'));
b.classList.add('on');cat=b.dataset.cat;apply();});
</script>`,
});

// 2. category pages
for (const c of categories) {
  page({
    rel: `category/${c.slug}.html`, depth: 1,
    title: `${c.name} — AI Model Prices Compared (${meta.updated}) | ${meta.site_name}`,
    description: `${c.blurb} Compare ${byCat(c.slug).length} models by price, context window and free tier.`,
    body: `<div class="hero"><span class="badge"><span class="dot"></span> Verified ${esc(meta.updated)}</span>
<h1>${esc(c.name)}: price comparison</h1><p>${esc(c.blurb)}</p></div>
${priceTable(byCat(c.slug), 1)}`,
  });
}

// 3. per-tool pages
for (const t of tools) {
  const p = t.pricing;
  const specs = Object.entries(t.specs).map(([k, v]) =>
    `<tr><th>${esc(k.replace(/_/g, " "))}</th><td>${esc(Array.isArray(v) ? v.join(", ") : v)}</td></tr>`).join("");
  const cta = t.affiliate_url
    ? `<a class="cta big" rel="sponsored nofollow" href="${esc(t.affiliate_url)}">Get ${esc(t.name)} →</a>`
    : `<a class="cta big" rel="nofollow" href="${esc(t.website)}">Visit ${esc(t.vendor)} →</a>`;
  const rivals = byCat(t.category).filter((x) => x.slug !== t.slug);
  page({
    rel: `tool/${t.slug}.html`, depth: 1,
    title: `${t.name} Pricing & Specs (${t.updated}) | ${meta.site_name}`,
    description: `${t.name} by ${t.vendor}: ${money(p.input)} input / ${money(p.output)} output ${p.unit}. Context ${t.specs.context_window}. Free tier: ${p.free_tier ? "yes" : "no"}.`,
    body: `<nav class="crumb"><a href="../index.html">Home</a> / <a href="../category/${t.category}.html">${esc(catName(t.category))}</a> / ${esc(t.name)}</nav>
<h1>${esc(t.name)} pricing</h1><p class="vendor">by ${esc(t.vendor)} · verified ${esc(t.updated)} · source: ${esc(t.source)}</p>
<div class="pricebox">
  <div><span class="label">Input</span><span class="num">${money(p.input)}</span></div>
  <div><span class="label">Output</span><span class="num">${money(p.output)}</span></div>
  <div><span class="label">Unit</span><span class="num small">${esc(p.unit)}</span></div>
  <div><span class="label">Free tier</span><span class="num small ${p.free_tier ? "free" : ""}">${p.free_tier ? "Yes" : "No"}</span></div>
</div>
${cta}
<h2>Specs</h2><div class="tablewrap"><table class="specs"><tbody>${specs}</tbody></table></div>
${rivals.length ? `<h2>Compare ${esc(t.name)} against</h2><div class="linkgrid">${rivals.map((o) => {
      const [a, b] = [t, o].sort((x, y) => x.slug.localeCompare(y.slug));
      return `<a href="${vsHref(a, b, 1)}">${esc(t.name)} vs ${esc(o.name)}</a>`;
    }).join("")}</div>
<h2>All ${esc(catName(t.category))} alternatives</h2>${priceTable(rivals, 1)}` : ""}`,
  });
}

// 4. vs comparison pages — the highest-intent search keywords ("x vs y pricing")
for (const [a, b] of pairs) {
  const cheaper = a.pricing.input === b.pricing.input ? null : (a.pricing.input < b.pricing.input ? a : b);
  const row = (label, va, vb, cls = "") =>
    `<tr><th style="color:var(--dim);font-weight:600">${label}</th><td class="${cls}">${va}</td><td class="${cls}">${vb}</td></tr>`;
  page({
    rel: `compare/${a.slug}-vs-${b.slug}.html`, depth: 1,
    title: `${a.name} vs ${b.name}: Price & Specs (${meta.updated}) | ${meta.site_name}`,
    description: `${a.name} (${money(a.pricing.input)}/${money(a.pricing.output)} ${a.pricing.unit}) vs ${b.name} (${money(b.pricing.input)}/${money(b.pricing.output)} ${b.pricing.unit}) — which is cheaper and when to pick each.`,
    body: `<div class="hero"><span class="badge"><span class="dot"></span> Verified ${esc(meta.updated)}</span>
<h1>${esc(a.name)} vs ${esc(b.name)}</h1>
<p>${cheaper ? `<span class="win">${esc(cheaper.name)}</span> is cheaper on input price. Full breakdown:` : "Identical input pricing — the differences are in the specs:"}</p></div>
<div class="tablewrap"><table>
<thead><tr><th></th><th>${esc(a.name)}</th><th>${esc(b.name)}</th></tr></thead>
<tbody>
${row("Vendor", esc(a.vendor), esc(b.vendor))}
${row("Input price", money(a.pricing.input), money(b.pricing.input), "num")}
${row("Output price", money(a.pricing.output), money(b.pricing.output), "num")}
${row("Unit", esc(a.pricing.unit), esc(b.pricing.unit), "num")}
${row("Context window", esc(a.specs.context_window), esc(b.specs.context_window), "num")}
${row("Free tier", a.pricing.free_tier ? "Yes" : "No", b.pricing.free_tier ? "Yes" : "No")}
${row("Best for", esc(a.specs.best_for), esc(b.specs.best_for))}
</tbody></table></div>
<div class="grid2">
  <div class="card"><h3>Pick ${esc(a.name)} if…</h3><p style="font-size:14px;margin:0">${esc(a.specs.best_for)} is what you're optimizing for.</p>
  <p style="margin:14px 0 0"><a class="cta" href="../tool/${a.slug}.html">${esc(a.name)} details →</a></p></div>
  <div class="card"><h3>Pick ${esc(b.name)} if…</h3><p style="font-size:14px;margin:0">${esc(b.specs.best_for)} is what you're optimizing for.</p>
  <p style="margin:14px 0 0"><a class="cta" href="../tool/${b.slug}.html">${esc(b.name)} details →</a></p></div>
</div>`,
  });
}

// 5. compare index
page({
  rel: "compare/index.html", depth: 1,
  title: `All AI Model Comparisons (${pairs.length}) | ${meta.site_name}`,
  description: `Every head-to-head AI model price comparison: ${pairs.length} matchups across LLM, image, video and audio.`,
  body: `<div class="hero"><h1>All comparisons</h1><p>${pairs.length} head-to-head matchups, re-verified daily.</p></div>
${categories.map((c) => {
    const list = pairs.filter(([x]) => x.category === c.slug);
    return list.length ? `<h2>${esc(c.name)}</h2><div class="linkgrid">${list.map(([a, b]) =>
      `<a href="${a.slug}-vs-${b.slug}.html">${esc(a.name)} vs ${esc(b.name)}</a>`).join("")}</div>` : "";
  }).join("")}`,
});

// 6. api docs + plans (Gumroad = the money pipe)
page({
  rel: "api-docs.html", depth: 0,
  title: `AI Pricing Data API — JSON for Your App | ${meta.site_name}`,
  description: `Machine-readable AI model pricing. Free daily JSON snapshot, or Pro subscription with license key via Gumroad.`,
  body: `<div class="hero"><h1>Pricing API</h1>
<p>The same daily-verified data, as clean JSON for your app, dashboard or agent.</p></div>
<div class="plans">
  <div class="plan"><h3>Free</h3><p class="price">$0<span> forever</span></p>
    <ul><li>Full current snapshot, all models</li><li>Updated daily</li><li>No key required — just attribution</li></ul>
    <pre>curl ${BASE}/api/tools.json</pre></div>
  <div class="plan featured"><h3>Pro</h3><p class="price">$19<span>/mo</span></p>
    <ul><li>Metered live endpoint + filters</li><li>Price history &amp; change alerts</li><li>Commercial license</li></ul>
    <a class="cta big" href="GUMROAD_PRODUCT_URL">Subscribe via Gumroad →</a>
    <p class="disclaimer">License key delivered instantly by Gumroad. Cancel anytime.</p></div>
</div>
<h2>Using your key</h2>
<pre>GET /api/tools            # all models
GET /api/tools?cat=llm    # filter by category
Header: x-api-key: YOUR_GUMROAD_LICENSE_KEY</pre>
<div class="note">Building something with this data? Attribution appreciated: “Pricing data by ${esc(meta.site_name)}”.</div>`,
});

// 7. methodology — the trust page
page({
  rel: "methodology.html", depth: 0,
  title: `Methodology — How Prices Are Verified | ${meta.site_name}`,
  description: `How ${meta.site_name} collects and verifies AI model pricing: official vendor pages only, checked daily, every row dated and sourced.`,
  body: `<div class="hero"><h1>Methodology</h1><p>Boring on purpose — that's what makes the numbers trustworthy.</p></div>
<div class="card" style="max-width:720px">
<ol style="margin:6px 0 0 18px;font-size:14.5px;display:grid;gap:10px">
<li><strong>Official sources only.</strong> Every price comes from the vendor's own pricing page or their primary hosting partner — never blogs or hearsay.</li>
<li><strong>Checked daily.</strong> An automated pipeline re-reads every source each day; changes are re-verified before publishing.</li>
<li><strong>Every row is dated.</strong> Each model shows when its price was last verified and what kind of source it came from.</li>
<li><strong>Referral links never touch the data.</strong> Some outbound links earn a commission; prices, rankings and comparisons are computed from the data alone.</li>
<li><strong>Corrections ship daily.</strong> Spot an error? It's fixed in the next build.</li>
</ol></div>`,
});

// 8. free JSON snapshot
write("api/tools.json", JSON.stringify({
  meta: { source: meta.site_name, updated: meta.updated, license: "Free tier — attribution required", docs: `${BASE}/api-docs.html` },
  count: tools.length, tools,
}, null, 2));

// 9. sitemap + robots + assets
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((rel) => `<url><loc>${BASE}/${rel === "index.html" ? "" : rel}</loc><lastmod>${meta.updated}</lastmod></url>`).join("\n")}
</urlset>`);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${BASE}/sitemap.xml\n`);
write(".nojekyll", "");
cpSync(join(ROOT, "assets", "style.css"), join(OUT, "style.css"));

console.log(`Built ${pages.length} pages -> /public`);
console.log(`  models: ${tools.length} | categories: ${categories.length} | comparisons: ${pairs.length}`);
