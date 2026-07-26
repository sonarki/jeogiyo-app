# HookForge 랜딩 — design brief (Phase 0)

## Design read
Performance marketers and DTC founders bleeding money on stale ad creative; the register is "industrial confidence": a production line that ships, not an agency that talks.

## Concept spine
**"The forge floor"**: the page is a working production line. Each section is a station on the line (intake, forge, output, price, dispatch). Copy speaks in throughput and delivery windows, visuals show output racks, the CTA is the order slip.

## Delivery tier
`editorial` (user picked Non-animated at intake). Typography + imagery + bespoke chrome, micro-motion only. Craft floor still applies: bespoke assets, motivated micro-motion, real type. No scroll-scrub journey.

## Animation mode
Animation mode: non-animated — user picked Non-animated at intake ("일반형").
Tier-1 lightweight technique: hero output-rack with staggered on-mount rise (transform-only), plus per-station hover physics on CTAs. No opacity-0 gates, everything reduced-motion safe.

## Locked palette (user's explicit brand colors — override of default ban)
The graphite+orange family is the USER'S established brand: approved logo/header (charcoal `#111318`, orange `#FF5C1F → #FF8A3D`, coin gold `#FFB53E`) already deployed on live TikTok/X/Gumroad profiles. Banned-family override is therefore legitimate per "overridable only by the user's explicit brand colors".
- Ground: `#111318` (page), `#171A20` (raised), `#1E222A` (lines/borders)
- Ink: `#F4F2EE` (primary), `#9BA0AA` (secondary)
- Accent (ONE): `#FF5C1F` (hover `#FF8A3D`) — CTAs, live markers, price highlights
- Support metal: coin gold `#FFB53E` used ONLY inside the brand mark + one price glyph, never as a second UI accent

## Locked type
- Display: **Outfit** (variable, 600/700) — geometric-industrial, matches the wordmark's grotesk energy
- Mono: **IBM Plex Mono** — spec labels, delivery clocks, price meta ("48:00:00", "SLOT 07/10")
- Body: Outfit 400. No serif anywhere.

## Section plan (6 sections, 5 layout families, eyebrow budget 2)
1. **Hero** — split 50/50: left copy stack (eyebrow "AI UGC AD STUDIO", H1, sub, CTA row), right = output rack visual (3 stacked 9:16 ad frames, staggered rise on mount). Family: split.
2. **The problem** — editorial numbered ledger: three cost lines of the old way (creator fees, waiting weeks, 3 creatives per month) set as oversized mono numerals with short lines. Family: numeral ledger.
3. **How the forge runs** — horizontal 3-step conveyor strip (Brief → Forge → Launch) with mono timestamps (T+0h, T+24h, T+48h); asymmetric widths, connected by a line. Family: conveyor timeline.
4. **Output samples** — 9:16 demo rack, horizontal scroll strip of phone frames (posters now, live demo videos swapped in when the batch lands). Family: media rail.
5. **Pricing** — asymmetric: TEST MATRIX featured large card left (accent border, mono "SLOT n/10" launch counter), HOOK PACK + FULL FUNNEL compact stacked right; agency line as a text row below. Family: featured asymmetric.
6. **FAQ + dispatch CTA** — divide-y accordion (5 Q) then full-width order-slip band: headline, one CTA. Family: accordion + band.

## Asset plan (lean editorial kit)
- Brand mark: inline SVG (hook+coins, from approved brand file) — crisp at all sizes, no image needed
- Hero output rack: 3 vertical ad-still frames — generated (beauty-demo stills, GLOWRA), swapped for real demo posters when the demo batch renders
- Section plates: 1 forge-texture backdrop for the dispatch band (generated, subtle)
- OG card + favicon: composed from brand mark (local SVG render pipeline)
- Icons: functional only, Phosphor thin set, mono-stroke, max 6 glyphs

## CTA inventory (each its own garment)
- `Get my 20 ads` (primary, hero + pricing featured): solid accent slab, mono price suffix, press = 1px sink + shadow collapse
- `See demo ads` (secondary, hero): ghost underline-grow, arrow nudge on hover
- `Talk to us` (agency, pricing footer row): mono text link with blinking terminal caret
- `Start my order` (dispatch band, final): full-width slab with delivery-clock mono readout on the right edge

## Copy rules honored
No em/en dashes anywhere visible. Headline ≤8 words. One label per CTA intent. No invented performance stats; product facts only (counts, hours, prices). AI production disclosed in footer and FAQ ("Fully AI-produced, human-directed, always labeled").

## Fulfillment/checkout wiring
- Primary CTA → Gumroad product URL (placeholder `GUMROAD_URL_TIER2` until listing live; wired before deploy or hidden behind waitlist form if listing not ready)
- Lead capture: order-brief form (name, email, brand URL, tier) → D1 (`db: true` in manifest) via server function; used for agency/inbound
- Footer: refund policy (miss the window = full refund), AI disclosure, contact email
