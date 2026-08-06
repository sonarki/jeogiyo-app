/* KitchenConvert — static site generator.
   Reads data/ingredients.json and writes one SEO page per ingredient plus
   pillar pages, hub, sitemap, robots and legal pages.  Run: `node generate.mjs`
   Add rows to the JSON and re-run to scale to hundreds of pages — no code edits.

   Paths are RELATIVE and depth-aware, so this folder is a self-contained site:
   deploy the contents of /kitchen as your web root (or open index.html locally). */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DOMAIN = "https://YOURDOMAIN.com"; // replace before deploy (kitchen folder = web root)
const ADS = "ca-pub-XXXXXXXXXXXXXXXX";   // replace after AdSense approval
const SITE = "KitchenConvert";

const ingredients = JSON.parse(fs.readFileSync(path.join(ROOT, "data/ingredients.json"), "utf8"));
const slug = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const OZ_G = 28.3495;
const fmt = (n) => n >= 100 ? Math.round(n).toLocaleString("en-US") : n >= 10 ? n.toFixed(1) : n.toFixed(2);
ingredients.forEach((i) => (i.slug = slug(i.name)));

// P = relative prefix for the page currently being built ("" at root, "../" in /convert)
let P = "";

function head(title, desc, canonicalRel, jsonld) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${DOMAIN}${canonicalRel}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${DOMAIN}${canonicalRel}" />
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%A5%84%3C/text%3E%3C/svg%3E" />
<link rel="stylesheet" href="${P}assets/style.css" />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS}" crossorigin="anonymous"></script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head>
<body>`;
}

function header() {
  return `<header class="site-header"><div class="container nav">
  <a class="brand" href="${P}index.html"><span class="logo">🥄</span><span>${SITE}</span></a>
  <nav class="nav-links">
    <a href="${P}cups-to-grams.html">Cups → Grams</a>
    <a href="${P}tablespoons-to-grams.html">Tbsp → Grams</a>
    <a href="${P}oven-temperature-conversion.html">Oven Temp</a>
    <a href="${P}index.html#ingredients">All Ingredients</a>
  </nav></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container">
  <strong style="color:#fff">${SITE}</strong> — free, accurate baking &amp; cooking measurement converters.
  <div class="fine">© 2026 ${SITE}. Values are standard reference conversions for general use.
  <a href="${P}about.html">About</a> · <a href="${P}privacy.html">Privacy</a> · <a href="${P}contact.html">Contact</a></div>
</div></footer>
<script src="${P}assets/convert.js"></script>
</body></html>`;
}

const COMMON = [0.25, 0.333, 0.5, 0.667, 0.75, 1, 1.5, 2, 3];
const label = (c) => ({ 0.25: "¼", 0.333: "⅓", 0.5: "½", 0.667: "⅔", 0.75: "¾", 1: "1", 1.5: "1½", 2: "2", 3: "3" }[c] || c);

function ingredientPage(ing) {
  P = "../";
  const g = ing.gpc;
  const rows = COMMON.map((c) => {
    const grams = c * g, oz = grams / OZ_G, tbsp = c * 16;
    return `<tr><td>${label(c)} cup${c === 1 ? "" : "s"}</td><td>${Math.round(tbsp)} tbsp</td><td>${fmt(grams)} g</td><td>${fmt(oz)} oz</td></tr>`;
  }).join("");
  const related = ingredients.filter((x) => x.cat === ing.cat && x.slug !== ing.slug).slice(0, 6)
    .map((x) => `<a href="${P}convert/${x.slug}.html">${x.name}</a>`).join("");

  const title = `${ing.name} Cups to Grams Converter + Chart | ${SITE}`;
  const desc = `How many grams in a cup of ${ing.name.toLowerCase()}? 1 cup = ${Math.round(g)} g. Free converter for cups, tablespoons, ounces and grams, with a printable reference chart.`;
  const faq = {
    "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: `How many grams are in a cup of ${ing.name.toLowerCase()}?`, acceptedAnswer: { "@type": "Answer", text: `One US cup of ${ing.name.toLowerCase()} weighs about ${Math.round(g)} grams (${fmt(g / OZ_G)} oz).` } },
      { "@type": "Question", name: `How many grams are in a tablespoon of ${ing.name.toLowerCase()}?`, acceptedAnswer: { "@type": "Answer", text: `One tablespoon of ${ing.name.toLowerCase()} is about ${fmt(g / 16)} grams, since a cup contains 16 tablespoons.` } },
      { "@type": "Question", name: `Why weigh ${ing.name.toLowerCase()} instead of using cups?`, acceptedAnswer: { "@type": "Answer", text: `Cups measure volume, which varies with how the ${ing.name.toLowerCase()} is packed. A kitchen scale gives the same result every time, so your baking is consistent.` } }
    ]
  };

  return head(title, desc, `/convert/${ing.slug}.html`, faq) + header() + `
<main class="container">
  <p class="breadcrumb"><a href="${P}index.html">Home</a> › ${ing.name}</p>
  <h1>${ing.name}: Cups to Grams</h1>
  <p class="lede">1 cup of ${ing.name.toLowerCase()} ≈ <strong>${Math.round(g)} g</strong> (${fmt(g / OZ_G)} oz). Convert any amount below.</p>

  <div class="card">
    <div class="calc" id="kc-calc" data-gpc="${g}" data-name="${ing.name}">
      <div class="row">
        <div class="field"><label for="kc-amount">Amount</label><input id="kc-amount" type="number" inputmode="decimal" value="1" step="any" min="0" /></div>
        <div class="field"><label for="kc-unit">Unit</label>
          <select id="kc-unit"><option value="cup" selected>Cups</option><option value="tbsp">Tablespoons</option><option value="tsp">Teaspoons</option><option value="ml">Milliliters</option><option value="floz">Fluid ounces</option></select>
        </div>
      </div>
      <div class="result"><p class="big" id="kc-grams">—</p><div class="sub" id="kc-sub"></div></div>
    </div>
  </div>

  <div class="ad-slot">Advertisement</div>

  <div class="card">
    <h2 style="margin-top:0">${ing.name} conversion chart</h2>
    <div class="scroll"><table>
      <thead><tr><th>Cups</th><th>Tablespoons</th><th>Grams</th><th>Ounces</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </div>

  <section class="prose">
    <h2>How to measure ${ing.name.toLowerCase()} accurately</h2>
    <p>${ing.note} Because cups measure volume and grams measure weight, a kitchen scale is the most reliable way to get consistent results — especially in baking, where small differences matter.</p>
    <div class="faq">
      <h2>FAQ</h2>
      <details open><summary>How many grams in a cup of ${ing.name.toLowerCase()}?</summary><p>About ${Math.round(g)} grams (${fmt(g / OZ_G)} oz) per US cup.</p></details>
      <details><summary>How many grams in a tablespoon?</summary><p>Roughly ${fmt(g / 16)} grams — a cup holds 16 tablespoons.</p></details>
      <details><summary>Is this US or metric cups?</summary><p>This uses the US legal cup (236.6 ml). A metric cup (250 ml) weighs about 6% more.</p></details>
    </div>
    ${related ? `<h3>Related conversions</h3><div class="related">${related}</div>` : ""}
    <p style="margin-top:16px"><a href="${P}cups-to-grams.html">← All cups-to-grams conversions</a></p>
  </section>

  <div class="ad-slot">Advertisement</div>
</main>` + footer();
}

function hubPage() {
  P = "";
  const cats = [...new Set(ingredients.map((i) => i.cat))];
  const sections = cats.map((cat) => {
    const items = ingredients.filter((i) => i.cat === cat)
      .map((i) => `<a class="tool-card" href="convert/${i.slug}.html"><h3>${i.name}</h3><p>1 cup ≈ ${Math.round(i.gpc)} g</p></a>`).join("");
    return `<div class="cat-label">${cat}</div><div class="grid">${items}</div>`;
  }).join("");
  const title = `${SITE} — Baking & Cooking Measurement Converter (Cups to Grams)`;
  const desc = `Free, accurate cups-to-grams converters for ${ingredients.length}+ ingredients, plus tablespoon, ounce and oven-temperature charts. Bake with confidence.`;
  return head(title, desc, "/index.html", { "@context": "https://schema.org", "@type": "WebSite", name: SITE, url: `${DOMAIN}/` }) + header() + `
<section class="hero"><div class="container">
  <h1>Cups to Grams, Made Simple</h1>
  <p>Accurate baking &amp; cooking conversions for ${ingredients.length}+ ingredients. How many grams in a cup? Find out in one tap — free, no sign-up.</p>
</div></section>
<main class="container">
  <div class="ad-slot">Advertisement</div>
  <div class="grid">
    <a class="tool-card" href="cups-to-grams.html"><h3>📊 Cups → Grams</h3><p>Master chart for every ingredient.</p></a>
    <a class="tool-card" href="tablespoons-to-grams.html"><h3>🥄 Tbsp → Grams</h3><p>Tablespoon weights at a glance.</p></a>
    <a class="tool-card" href="oven-temperature-conversion.html"><h3>🌡️ Oven Temp</h3><p>°C ↔ °F ↔ Gas Mark converter.</p></a>
  </div>
  <h2 id="ingredients">All ingredients</h2>
  ${sections}
  <div class="ad-slot">Advertisement</div>
  <section class="prose card">
    <h2 style="margin-top:0">Why weight beats volume in baking</h2>
    <p>A "cup" of flour can vary by 20% depending on how you scoop it — enough to turn a tender cake dense. Weighing ingredients in grams removes the guesswork, which is why every professional recipe lists weights. These converters give you the standard reference weight for each ingredient instantly.</p>
  </section>
</main>` + footer();
}

function cupsToGramsPillar() {
  P = "";
  const rows = ingredients.map((i) => `<tr><td><a href="convert/${i.slug}.html">${i.name}</a></td><td>${Math.round(i.gpc)} g</td><td>${fmt(i.gpc / OZ_G)} oz</td><td>${fmt(i.gpc / 16)} g</td></tr>`).join("");
  const title = `Cups to Grams Conversion Chart for ${ingredients.length}+ Ingredients | ${SITE}`;
  const desc = `Master cups-to-grams chart: exact weight of one cup for flour, sugar, butter, liquids and more. Click any ingredient for a full converter and chart.`;
  return head(title, desc, "/cups-to-grams.html", null) + header() + `
<main class="container">
  <p class="breadcrumb"><a href="index.html">Home</a> › Cups to Grams</p>
  <h1>Cups to Grams Conversion Chart</h1>
  <p class="lede">The weight of one US cup for every ingredient. Click a name for its own converter.</p>
  <div class="ad-slot">Advertisement</div>
  <div class="card"><div class="scroll"><table>
    <thead><tr><th>Ingredient</th><th>1 cup</th><th>1 cup (oz)</th><th>1 tbsp</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div></div>
  <section class="prose"><h2>How to use this chart</h2>
  <p>Find your ingredient, read across for the weight of one cup. Need a different amount — a half cup, three tablespoons? Click the ingredient name to open a live converter with a full chart.</p></section>
  <div class="ad-slot">Advertisement</div>
</main>` + footer();
}

function tbspToGramsPillar() {
  P = "";
  const rows = ingredients.map((i) => `<tr><td><a href="convert/${i.slug}.html">${i.name}</a></td><td>${fmt(i.gpc / 16)} g</td><td>${fmt(i.gpc / 48)} g</td></tr>`).join("");
  const title = `Tablespoons to Grams Chart for Common Ingredients | ${SITE}`;
  const desc = `How many grams in a tablespoon? Exact tablespoon and teaspoon weights for flour, sugar, butter, cocoa and more.`;
  return head(title, desc, "/tablespoons-to-grams.html", null) + header() + `
<main class="container">
  <p class="breadcrumb"><a href="index.html">Home</a> › Tablespoons to Grams</p>
  <h1>Tablespoons to Grams</h1>
  <p class="lede">One tablespoon = 1/16 of a cup. Here is the weight of a tablespoon and teaspoon for each ingredient.</p>
  <div class="ad-slot">Advertisement</div>
  <div class="card"><div class="scroll"><table>
    <thead><tr><th>Ingredient</th><th>1 tbsp</th><th>1 tsp</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div></div>
  <div class="ad-slot">Advertisement</div>
</main>` + footer();
}

function ovenPage() {
  P = "";
  const temps = [[120, 250, "½"], [140, 275, "1"], [150, 300, "2"], [160, 325, "3"], [180, 350, "4"], [190, 375, "5"], [200, 400, "6"], [220, 425, "7"], [230, 450, "8"], [240, 475, "9"]];
  const rows = temps.map((t) => `<tr><td>${t[0]} °C</td><td>${t[1]} °F</td><td>${t[2]}</td><td>${t[1] <= 300 ? "Low" : t[1] <= 375 ? "Moderate" : "Hot"}</td></tr>`).join("");
  const title = `Oven Temperature Conversion: °C to °F to Gas Mark | ${SITE}`;
  const desc = `Convert oven temperatures between Celsius, Fahrenheit and Gas Mark with a live converter and full chart. Fan/convection guidance included.`;
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "What is 180°C in Fahrenheit?", acceptedAnswer: { "@type": "Answer", text: "180°C equals 350°F, or Gas Mark 4 — the most common baking temperature." } },
    { "@type": "Question", name: "How do I adjust for a fan oven?", acceptedAnswer: { "@type": "Answer", text: "For a fan (convection) oven, reduce the temperature by about 20°C (or 25°F) from the conventional setting." } }
  ] };
  return head(title, desc, "/oven-temperature-conversion.html", faq) + header() + `
<main class="container">
  <p class="breadcrumb"><a href="index.html">Home</a> › Oven Temperature</p>
  <h1>Oven Temperature Conversion</h1>
  <p class="lede">Convert between °C, °F and Gas Mark instantly.</p>
  <div class="card"><div class="calc" id="kc-oven">
    <div class="row">
      <div class="field"><label for="kc-c">Celsius (°C)</label><input id="kc-c" type="number" inputmode="decimal" value="180" step="any" /></div>
      <div class="field"><label for="kc-f">Fahrenheit (°F)</label><input id="kc-f" type="number" inputmode="decimal" value="356" step="any" /></div>
    </div>
  </div></div>
  <div class="ad-slot">Advertisement</div>
  <div class="card"><h2 style="margin-top:0">Oven temperature chart</h2>
    <div class="scroll"><table>
      <thead><tr><th>Celsius</th><th>Fahrenheit</th><th>Gas Mark</th><th>Description</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </div>
  <section class="prose"><div class="faq"><h2>FAQ</h2>
    <details open><summary>What is 180°C in Fahrenheit?</summary><p>180°C = 350°F = Gas Mark 4, the standard baking temperature.</p></details>
    <details><summary>How do I adjust for a fan oven?</summary><p>Lower the temperature by about 20°C (25°F) versus a conventional oven.</p></details>
  </div></section>
  <div class="ad-slot">Advertisement</div>
</main>` + footer();
}

function legal(titleWord, bodyHtml, pathName) {
  P = "";
  const title = `${titleWord} | ${SITE}`;
  return head(title, `${titleWord} for ${SITE}.`, `/${pathName}`, null) + header() +
    `<main class="container"><p class="breadcrumb"><a href="index.html">Home</a> › ${titleWord}</p>
     <h1>${titleWord}</h1><section class="prose card">${bodyHtml}</section></main>` + footer();
}

// ---------- write files ----------
const OUT = ROOT;
fs.mkdirSync(path.join(OUT, "convert"), { recursive: true });
let count = 0;
for (const ing of ingredients) { fs.writeFileSync(path.join(OUT, "convert", ing.slug + ".html"), ingredientPage(ing)); count++; }
fs.writeFileSync(path.join(OUT, "index.html"), hubPage());
fs.writeFileSync(path.join(OUT, "cups-to-grams.html"), cupsToGramsPillar());
fs.writeFileSync(path.join(OUT, "tablespoons-to-grams.html"), tbspToGramsPillar());
fs.writeFileSync(path.join(OUT, "oven-temperature-conversion.html"), ovenPage());

fs.writeFileSync(path.join(OUT, "about.html"), legal("About",
  `<p>${SITE} provides fast, accurate baking and cooking measurement conversions. Every value is a standard reference weight for the US legal cup (236.6 ml), the same figures used in professional recipes.</p>
   <p>Our converters run entirely in your browser — no accounts, no tracking of what you type. We're supported by advertising so the tools stay free. See our <a href="privacy.html">Privacy Policy</a>.</p>
   <p>Spotted a value you'd refine, or want an ingredient added? <a href="contact.html">Contact us</a>.</p>`, "about.html"));

fs.writeFileSync(path.join(OUT, "privacy.html"), legal("Privacy Policy",
  `<p><em>Last updated 2026.</em> Values you enter are processed locally in your browser and are not stored on our servers.</p>
   <h2>Cookies &amp; advertising</h2>
   <p>We use Google AdSense to show ads. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other sites. You can opt out of personalized advertising via <a href="https://www.google.com/settings/ads" rel="nofollow noopener">Google Ads Settings</a> or <a href="https://www.aboutads.info/choices/" rel="nofollow noopener">aboutads.info/choices</a>.</p>
   <h2>Analytics</h2><p>We may collect anonymous, aggregate usage statistics to improve the site.</p>`, "privacy.html"));

fs.writeFileSync(path.join(OUT, "contact.html"), legal("Contact",
  `<p>Questions, corrections or ingredient requests are welcome.</p>
   <p><strong>Email:</strong> <a href="mailto:hello@YOURDOMAIN.com">hello@YOURDOMAIN.com</a></p>`, "contact.html"));

// sitemap + robots + ads.txt (absolute URLs; kitchen folder assumed = web root)
const urls = [
  "/index.html", "/cups-to-grams.html", "/tablespoons-to-grams.html", "/oven-temperature-conversion.html",
  "/about.html", "/privacy.html", "/contact.html",
  ...ingredients.map((i) => `/convert/${i.slug}.html`)
];
fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${DOMAIN}${u}</loc><changefreq>monthly</changefreq></url>`).join("\n") + `\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nUser-agent: Mediapartners-Google\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, "ads.txt"), `google.com, ${ADS.replace("ca-", "")}, DIRECT, f08c47fec0942fa0\n`);

console.log(`Generated ${count} ingredient pages + hub + 3 pillars + 3 legal. Total URLs: ${urls.length}`);
