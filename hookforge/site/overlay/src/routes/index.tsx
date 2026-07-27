import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const GUMROAD_URL = "https://hookforgestudio.gumroad.com/l/bxnwkl";
const CONTACT_EMAIL = "hookforge.aistudio@gmail.com";
const CONTACT_URL = "mailto:hookforge.aistudio@gmail.com?subject=HookForge%20order%20inquiry";
const PRIMARY_CTA = "Get my 20 ads";

function EmailButton({ label, block }: { label?: string; block?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = CONTACT_URL;
    }
  };
  return (
    <button
      onClick={copy}
      className={`font-monox inline-flex items-center gap-2 rounded-lg border border-[#FF5C1F]/40 bg-[#FF5C1F]/10 px-3.5 py-2 text-sm text-[#FF8A3D] transition-colors hover:bg-[#FF5C1F]/20 ${block ? "w-full justify-center" : ""}`}
      title="Click to copy our email"
    >
      {copied ? "✓ Copied — paste in your email app" : label ?? CONTACT_EMAIL}
    </button>
  );
}

function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" aria-hidden="true">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF8A3D" />
          <stop offset="1" stopColor="#FF5C1F" />
        </linearGradient>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD97A" />
          <stop offset="1" stopColor="#FFB53E" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#FF8A3D" strokeLinecap="round" opacity="0.45">
        <path d="M155 170 Q 165 360 395 480" strokeWidth="26" />
      </g>
      <g transform="rotate(-30 512 570)">
        <g fill="none" stroke="url(#hg)" strokeWidth="78" strokeLinecap="round">
          <circle cx="655" cy="250" r="30" strokeWidth="52" />
          <path d="M655 300 L655 590 A178 178 0 1 1 318 528" />
          <path d="M318 528 L372 578" strokeWidth="64" />
        </g>
      </g>
      <g transform="rotate(14 185 245)">
        <circle cx="185" cy="245" r="58" fill="url(#cg)" stroke="#B87514" strokeWidth="8" />
      </g>
      <g transform="rotate(-9 300 330)">
        <circle cx="300" cy="330" r="72" fill="url(#cg)" stroke="#B87514" strokeWidth="9" />
      </g>
      <g transform="rotate(8 415 475)">
        <circle cx="415" cy="475" r="88" fill="url(#cg)" stroke="#B87514" strokeWidth="10" />
      </g>
    </svg>
  );
}

type PosterProps = {
  tag: string;
  line1: string;
  line2: string;
  accent?: boolean;
  delay: string;
};

function AdPoster({ tag, line1, line2, accent, delay }: PosterProps) {
  return (
    <div
      className="rack-rise w-[168px] shrink-0 rounded-2xl border border-[#1E222A] bg-[#171A20] p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] md:w-[196px]"
      style={{ aspectRatio: "9/16", animationDelay: delay }}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-monox text-[10px] tracking-[0.18em] text-[#9BA0AA]">{tag}</span>
          <span className="h-2 w-2 rounded-full bg-[#FF5C1F]" />
        </div>
        <div>
          <p className={`font-display text-lg leading-tight ${accent ? "text-[#FF8A3D]" : "text-[#F4F2EE]"}`}>
            {line1}
          </p>
          <p className="mt-2 text-[11px] leading-snug text-[#9BA0AA]">{line2}</p>
        </div>
        <div className="flex items-center justify-between border-t border-[#1E222A] pt-3">
          <span className="font-monox text-[10px] text-[#9BA0AA]">GLOWRA DEMO</span>
          <span className="font-monox text-[10px] text-[#FF8A3D]">9:16</span>
        </div>
      </div>
    </div>
  );
}

function DemoVideo({ tag, src }: { tag: string; src: string }) {
  return (
    <div className="w-[196px] shrink-0 md:w-[220px]">
      <div
        className="overflow-hidden rounded-2xl border border-[#1E222A] bg-[#171A20] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
        style={{ aspectRatio: "9/16" }}
      >
        <video
          src={src}
          controls
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="font-monox mt-2 text-center text-[10px] tracking-[0.18em] text-[#9BA0AA]">
        {tag} / AI-MADE IN UNDER 1H
      </p>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-dvh bg-[#111318] text-[#F4F2EE]">
      {/* NAV */}
      <header className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
        <a href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="font-display text-lg font-bold tracking-[0.08em]">HOOKFORGE</span>
        </a>
        <nav className="flex items-center gap-6">
          <a href="#pricing" className="hidden text-sm text-[#9BA0AA] transition-colors hover:text-[#F4F2EE] sm:block">
            Pricing
          </a>
          <a
            href="#pricing"
            className="rounded-lg bg-[#FF5C1F] px-4 py-2 text-sm font-semibold text-[#111318] transition-transform hover:bg-[#FF8A3D] active:translate-y-[1px]"
          >
            {PRIMARY_CTA}
          </a>
        </nav>
      </header>

      {/* S1 HERO: split */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-24 pt-14 md:grid-cols-2 md:pt-20">
        <div>
          <p className="font-monox text-xs tracking-[0.22em] text-[#FF8A3D]">AI UGC AD STUDIO</p>
          <h1 className="font-display mt-4 text-4xl font-bold leading-none tracking-tighter md:text-6xl">
            Stale ads are burning your budget.
          </h1>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-[#9BA0AA]">
            HookForge ships 20 ready-to-run UGC style video ads for your product in 48 hours. AI
            produced, human directed, fully disclosed.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <a
              href="#pricing"
              className="rounded-xl bg-[#FF5C1F] px-6 py-3.5 font-display text-base font-bold text-[#111318] shadow-[0_10px_30px_-10px_rgba(255,92,31,0.7)] transition-all hover:bg-[#FF8A3D] active:translate-y-[1px] active:shadow-none"
            >
              {PRIMARY_CTA}
              <span className="font-monox ml-2 text-sm font-normal opacity-80">$990</span>
            </a>
            <a href="#demos" className="group text-sm font-medium text-[#F4F2EE]">
              See demo ads
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
              <span className="block h-px max-w-0 bg-[#FF8A3D] transition-all duration-300 group-hover:max-w-full" />
            </a>
          </div>
        </div>
        <div className="flex justify-center gap-4 md:justify-end">
          <div className="translate-y-6 rotate-[-5deg]">
            <AdPoster
              tag="HOOK 01"
              line1="My skin looked so tired lately."
              line2="Talking head testimonial, problem first."
              delay="0ms"
            />
          </div>
          <div className="-translate-y-2 rotate-[2deg]">
            <AdPoster
              tag="HOOK 04"
              line1="Glow in a bottle."
              line2="ASMR macro drop, no voiceover, caption only."
              accent
              delay="120ms"
            />
          </div>
          <div className="hidden translate-y-10 rotate-[6deg] lg:block">
            <AdPoster
              tag="HOOK 07"
              line1="What is your skincare secret?"
              line2="Street interview format, real reaction beat."
              delay="240ms"
            />
          </div>
        </div>
      </section>

      {/* S2 LEDGER */}
      <section className="border-t border-[#1E222A]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display max-w-[24ch] text-3xl font-bold tracking-tight md:text-4xl">
            The old way costs more than money.
          </h2>
          <div className="mt-12 space-y-8">
            <div className="flex items-baseline gap-6 border-b border-[#1E222A] pb-8">
              <span className="font-monox w-28 shrink-0 text-5xl font-semibold text-[#FF5C1F] md:w-40 md:text-6xl">
                $150
              </span>
              <p className="max-w-[52ch] text-[#9BA0AA]">
                per video from human UGC marketplaces, before usage rights and reshoots.
              </p>
            </div>
            <div className="flex items-baseline gap-6 border-b border-[#1E222A] pb-8">
              <span className="font-monox w-28 shrink-0 text-5xl font-semibold text-[#FF5C1F] md:w-40 md:text-6xl">
                14d
              </span>
              <p className="max-w-[52ch] text-[#9BA0AA]">
                from brief to first cut while your winning creative fatigues and CPMs climb.
              </p>
            </div>
            <div className="flex items-baseline gap-6">
              <span className="font-monox w-28 shrink-0 text-5xl font-semibold text-[#FF5C1F] md:w-40 md:text-6xl">
                3
              </span>
              <p className="max-w-[52ch] text-[#9BA0AA]">
                creatives a month is what most brands manage. Ad platforms reward twenty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* S3 CONVEYOR */}
      <section className="border-t border-[#1E222A] bg-[#14171D]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Brief in. Ads out. 48 hours.
          </h2>
          <div className="relative mt-14 grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.2fr_1fr] md:gap-6">
            <div className="absolute left-0 right-0 top-[14px] hidden h-px bg-[#1E222A] md:block" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="relative z-10 h-7 w-7 rounded-full border-2 border-[#FF5C1F] bg-[#14171D]" />
                <span className="font-monox text-xs tracking-[0.2em] text-[#FF8A3D]">T+0H</span>
              </div>
              <h3 className="font-display mt-4 text-xl font-semibold">Brief</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9BA0AA]">
                A product link, three photos, ten minutes of your time. We take it from there.
              </p>
            </div>
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="relative z-10 h-7 w-7 rounded-full border-2 border-[#FF5C1F] bg-[#FF5C1F]" />
                <span className="font-monox text-xs tracking-[0.2em] text-[#FF8A3D]">T+24H</span>
              </div>
              <h3 className="font-display mt-4 text-xl font-semibold">Forge</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9BA0AA]">
                Five hook angles across four formats: talking head, ASMR close-up, unboxing, street
                style. Every cut passes a human quality check.
              </p>
            </div>
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="relative z-10 h-7 w-7 rounded-full border-2 border-[#FF5C1F] bg-[#14171D]" />
                <span className="font-monox text-xs tracking-[0.2em] text-[#FF8A3D]">T+48H</span>
              </div>
              <h3 className="font-display mt-4 text-xl font-semibold">Launch</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#9BA0AA]">
                Vertical 9:16, captions burned in, ad copy included, commercial license yours. Drop
                straight into TikTok or Meta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* S4 DEMO RAIL */}
      <section id="demos" className="border-t border-[#1E222A]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Fresh from the forge.
            </h2>
            <p className="font-monox text-xs tracking-[0.16em] text-[#9BA0AA]">
              DEMO CAMPAIGN / GLOWRA (FICTIONAL BRAND)
            </p>
          </div>
          <div className="scrollbar-none -mx-5 mt-10 flex gap-5 overflow-x-auto px-5 pb-4">
            <DemoVideo tag="TESTIMONIAL 1080P" src="https://d8j0ntlcm91z4.cloudfront.net/user_2wX3UthAZov98dVbNmHugZwVghT/hf_20260727_013928_0d5ce4bd-f2f1-4df6-8f6b-9362b0255ce1.mp4" />
            <DemoVideo tag="ASMR UNBOX" src="https://d8j0ntlcm91z4.cloudfront.net/user_2wX3UthAZov98dVbNmHugZwVghT/hf_20260726_153455_052e762a-6959-4931-b582-48ffd19f1a81.mp4" />
            <DemoVideo tag="TRANSFORMATION" src="https://d8j0ntlcm91z4.cloudfront.net/user_2wX3UthAZov98dVbNmHugZwVghT/hf_20260726_153502_13bd8f40-34a8-4482-b5fa-0ef0f75e3c14.mp4" />
            <DemoVideo tag="SKEPTIC" src="https://d8j0ntlcm91z4.cloudfront.net/user_2wX3UthAZov98dVbNmHugZwVghT/hf_20260726_153513_32a610c0-9463-47cf-9793-d1f5c81842b5.mp4" />
            <div
              className="flex w-[168px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#FF5C1F]/50 bg-[#171A20]/50 p-4 text-center md:w-[196px]"
              style={{ aspectRatio: "9/16" }}
            >
              <p className="font-display text-lg font-semibold text-[#F4F2EE]">Your product here</p>
              <p className="text-[11px] text-[#9BA0AA]">Twenty of these, tuned to your brand.</p>
              <a href="#pricing" className="mt-1 rounded-lg bg-[#FF5C1F] px-3.5 py-2 text-xs font-bold text-[#111318] transition-colors hover:bg-[#FF8A3D]">
                {PRIMARY_CTA}
              </a>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#9BA0AA]">
            Sample stills from our demo pipeline. Every HookForge deliverable is AI produced and
            labeled as such.
          </p>
          <img
            src="/assets/brand/matrix.png"
            alt="HookForge test matrix: one brief becomes 20 ads in 48 hours"
            className="mt-10 w-full rounded-2xl border border-[#1E222A]"
          />
        </div>
      </section>

      {/* S5 PRICING */}
      <section id="pricing" className="border-t border-[#1E222A] bg-[#14171D]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Launch pricing. First ten clients.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border-2 border-[#FF5C1F] bg-[#171A20] p-8">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">TEST MATRIX</h3>
                <span className="font-monox rounded bg-[#FF5C1F]/15 px-2.5 py-1 text-[11px] tracking-[0.14em] text-[#FF8A3D]">
                  MOST PICKED
                </span>
              </div>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-5xl font-bold">$990</span>
                <span className="font-monox text-sm text-[#9BA0AA] line-through">$1,900 after launch</span>
              </div>
              <ul className="mt-7 space-y-3 text-sm text-[#9BA0AA]">
                <li className="flex gap-3"><span className="text-[#FF8A3D]">▸</span>20 video ads: 10 hooks, 2 variants each</li>
                <li className="flex gap-3"><span className="text-[#FF8A3D]">▸</span>10 static image ads for retargeting</li>
                <li className="flex gap-3"><span className="text-[#FF8A3D]">▸</span>Ad copy bank: 3 captions per creative</li>
                <li className="flex gap-3"><span className="text-[#FF8A3D]">▸</span>One revision round on your picks</li>
                <li className="flex gap-3"><span className="text-[#FF8A3D]">▸</span>48 hour delivery window, refund if we miss it</li>
                <li className="flex gap-3"><span className="text-[#FF8A3D]">▸</span>Full commercial license</li>
              </ul>
              <a
                href={GUMROAD_URL}
                className="mt-8 block rounded-xl bg-[#FF5C1F] py-4 text-center font-display text-base font-bold text-[#111318] transition-all hover:bg-[#FF8A3D] active:translate-y-[1px]"
              >
                {PRIMARY_CTA}
              </a>
            </div>
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-[#1E222A] bg-[#171A20] p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-bold">HOOK PACK</h3>
                  <span className="font-display text-3xl font-bold">$490</span>
                </div>
                <p className="mt-3 text-sm text-[#9BA0AA]">
                  10 video ads, copy bank, 48 hour delivery. The starter dose.
                </p>
                <div className="mt-4"><EmailButton label="Order by email →" /></div>
              </div>
              <div className="rounded-2xl border border-[#1E222A] bg-[#171A20] p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-bold">FULL FUNNEL</h3>
                  <span className="font-display text-3xl font-bold">$2,490</span>
                </div>
                <p className="mt-3 text-sm text-[#9BA0AA]">
                  40 video ads, 20 statics, landing refresh, 30 day content calendar, two revision
                  rounds, 72 hours.
                </p>
                <div className="mt-4"><EmailButton label="Order by email →" /></div>
              </div>
              <div className="px-1 text-sm text-[#9BA0AA]">
                <p>Agencies: white label packs from $4,900. Questions on any tier? Email us:</p>
                <div className="mt-2"><EmailButton /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S6 FAQ + DISPATCH */}
      <section className="border-t border-[#1E222A]">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <h2 className="font-display text-3xl font-bold tracking-tight">Questions, answered.</h2>
          <div className="mt-8 divide-y divide-[#1E222A]">
            <details className="faq group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                Are these really AI generated?
                <span className="text-[#FF8A3D] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#9BA0AA]">
                Yes, and we say so on every deliverable. That is how we hit 48 hours at this price.
                Every ad passes a human quality check before delivery, and we handle AI disclosure
                labeling correctly, which most sellers get wrong.
              </p>
            </details>
            <details className="faq group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                Will AI ads actually convert?
                <span className="text-[#FF8A3D] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#9BA0AA]">
                UGC style AI ads are already standard practice in DTC. The format wins on volume
                testing, not on any single perfect video. Twenty variations beat three handmade
                videos in nearly every account structure.
              </p>
            </details>
            <details className="faq group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                What do you need from me?
                <span className="text-[#FF8A3D] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#9BA0AA]">
                A product link, three or more product photos, and ten minutes for the brief form.
                That is the whole job on your side.
              </p>
            </details>
            <details className="faq group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                What if I do not like them?
                <span className="text-[#FF8A3D] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#9BA0AA]">
                Test Matrix and Full Funnel include revision rounds on your picked creatives. And if
                we miss the delivery window, you get a full refund, no questions.
              </p>
            </details>
            <details className="faq group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                Who is behind this?
                <span className="text-[#FF8A3D] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[#9BA0AA]">
                HookForge is an AI native ad studio: a human creative director running an industrial
                grade AI production pipeline. We launched this week, which is exactly why the price
                is this low. It will not stay.
              </p>
            </details>
          </div>
        </div>
        <div className="border-t border-[#1E222A] bg-[#14171D]">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-14 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                Your competitors test 20 creatives a week.
              </h2>
              <p className="font-monox mt-2 text-xs tracking-[0.18em] text-[#9BA0AA]">
                48:00:00 STARTS THE MOMENT YOUR BRIEF LANDS
              </p>
            </div>
            <a
              href="#pricing"
              className="shrink-0 rounded-xl bg-[#FF5C1F] px-8 py-4 font-display text-lg font-bold text-[#111318] transition-all hover:bg-[#FF8A3D] active:translate-y-[1px]"
            >
              {PRIMARY_CTA}
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1E222A]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-[#9BA0AA] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <Mark size={26} />
            <span className="font-display font-bold tracking-[0.08em] text-[#F4F2EE]">HOOKFORGE</span>
          </div>
          <p className="max-w-[52ch]">
            Fully AI produced, human directed. Every deliverable is labeled as AI generated. Miss
            the delivery window and you get a full refund.
          </p>
          <EmailButton />
        </div>
      </footer>
    </div>
  );
}
