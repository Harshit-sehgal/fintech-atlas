"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { CompanyLogo } from "@/components/ui/company-logo";
import { CURRENCIES, DEFAULT_CURRENCY, DEFAULT_SEND_AMOUNT, REMITTANCE_PROVIDERS } from "@/data/remittance-config";
import {
  computeProviderPayouts,
  RemittanceInputs,
} from "@/lib/remittance";
import { animationPresets as animation } from "@/lib/animation";

export default function RemittanceCalculatorPageClient() {
  const [sendAmount, setSendAmount] = useState<number>(DEFAULT_SEND_AMOUNT);
  const [currencyCode, setCurrencyCode] = useState<string>(DEFAULT_CURRENCY);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const targetCurr = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  const inputs: RemittanceInputs = {
    sendAmount,
    currency: targetCurr,
  };

  const providers = computeProviderPayouts(REMITTANCE_PROVIDERS, inputs);
  const bestProvider = providers[0];
  const worstProvider = providers[providers.length - 1];
  const savings = bestProvider.netPayout - worstProvider.netPayout;

  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <div className="mb-6 flex items-center gap-2 text-xs text-[var(--muted-text)] font-mono">
        <Link href="/tools" className="hover:text-[var(--foreground)] transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium">Cross-Border FX Estimator</span>
      </div>

      <SectionHeading
        headingLevel={1}
        eyebrow="Foreign Exchange Tool"
        title="Cross-Border Money Transfer Calculator"
        description="See hidden exchange markups and upfront transfer fees to maximize money received abroad. Rates are reference snapshots (see note below), not live quotes."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Controls */}
        <div className="surface lg:col-span-5 space-y-6 rounded-2xl border border-[var(--border-color)] p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)] border-b border-[var(--border-color)] pb-3">
            Transfer Details
          </h2>

          {/* Amount slider */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="r-slider-send-amount" className="font-medium text-[var(--muted-text)]">You Send (USD)</label>
              <span className="font-mono font-bold text-[var(--foreground)]">${sendAmount.toLocaleString()}</span>
            </div>
            <input
              id="r-slider-send-amount"
              type="range"
              min="100"
              max="20000"
              step="100"
              value={sendAmount}
              onChange={(e) => setSendAmount(Number(e.target.value))}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[var(--muted-text)] mt-1 font-mono">
              <span>$100</span>
              <span>$5,000</span>
              <span>$20,000</span>
            </div>
          </div>

          {/* Currency picker */}
          <div>
            <label id="recipient-currency-label" className="block text-sm font-medium text-[var(--muted-text)] mb-2">
              Recipient Currency
            </label>
            <div
              role="radiogroup"
              aria-labelledby="recipient-currency-label"
              className="grid grid-cols-2 gap-2"
            >
              {CURRENCIES.map((c, index) => {
                const active = currencyCode === c.code;
                const isFocused = focusedIndex === index;
                return (
                  <button
                    key={c.code}
                    role="radio"
                    aria-checked={active}
                    tabIndex={isFocused ? 0 : -1}
                    onClick={() => {
                      setFocusedIndex(index);
                      setCurrencyCode(c.code);
                    }}
                    onFocus={() => setFocusedIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        const nextIndex = (focusedIndex + 1) % CURRENCIES.length;
                        setFocusedIndex(nextIndex);
                        setCurrencyCode(CURRENCIES[nextIndex].code);
                      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prevIndex = (focusedIndex - 1 + CURRENCIES.length) % CURRENCIES.length;
                        setFocusedIndex(prevIndex);
                        setCurrencyCode(CURRENCIES[prevIndex].code);
                      } else if (e.key === 'Home') {
                        e.preventDefault();
                        setFocusedIndex(0);
                        setCurrencyCode(CURRENCIES[0].code);
                      } else if (e.key === 'End') {
                        e.preventDefault();
                        setFocusedIndex(CURRENCIES.length - 1);
                        setCurrencyCode(CURRENCIES[CURRENCIES.length - 1].code);
                      } else if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setCurrencyCode(c.code);
                      }
                    }}
                    className={`relative flex items-center justify-between rounded-lg border p-3 text-left transition-all overflow-hidden focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                      active
                        ? "border-[var(--accent)] text-[var(--foreground)] font-bold"
                        : "border-[var(--border-color)] hover:border-[var(--border-strong)] focus-visible:border-[var(--border-strong)] text-[var(--muted-text)] focus-visible:text-[var(--foreground)]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="fx-currency"
                        className="absolute inset-0 -z-10 bg-[var(--accent)]/10"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <div>
                      <div className="text-sm">{c.code} ({c.symbol})</div>
                      <div className="text-[11px] font-normal opacity-70">{c.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FX Benchmark */}
          <div className="surface rounded-xl border border-[var(--border-color)] p-4 text-xs space-y-1">
            <div className="text-[var(--muted-text)] uppercase font-mono tracking-wider text-[10px]">Reference Mid-Market Rate</div>
            <div className="font-mono font-bold text-sm text-[var(--foreground)]">
              1 USD = {targetCurr.rate} {targetCurr.code}
            </div>
            <p className="text-[11px] text-[var(--muted-text)]">
              The fair exchange rate quoted on financial markets (Google, Bloomberg, Wise).
            </p>
          </div>
        </div>

        {/* Comparison output */}
        <div className="lg:col-span-7 space-y-6">
          <Reveal>
            <div className="surface rounded-2xl border border-[var(--border-color)] p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                <div>
                  <span className="eyebrow text-[var(--muted-text)]">Maximum Received</span>
                  <h3 className="mt-1 text-lg font-bold text-[var(--foreground)]">
                    {bestProvider.name} delivers the most money
                  </h3>
                </div>
                <div className="rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/30 px-4 py-2 text-right">
                  <div className="text-xs text-success-text">Save up to</div>
                  <div className="text-lg font-bold font-mono text-success-text">
                    {targetCurr.symbol}{Math.round(savings).toLocaleString()} {targetCurr.code}
                  </div>
                </div>
              </div>

              {/* Provider table */}
              <div className="mt-6 space-y-4">
                {providers.map((p, i) => {
                  const isBest = p.name === bestProvider.name;
                  const maxPayout = Math.max(...providers.map((x) => x.netPayout));
                  // Guard against div-by-zero (e.g. a zero mid-market rate or a
                  // fee that equals the full send amount) — mirrors the
                  // calculator's barWidth guard. Without it maxPayout=0 yields
                  // NaN % width and the bar fails to render.
                  const barWidth = maxPayout > 0 ? (Math.max(0, p.netPayout) / maxPayout) * 100 : 0;

                  return (
                    <div
                      key={p.name}
                      className={`rounded-xl border p-4 transition-all ${
                        isBest
                          ? "border-[var(--success)]/50 bg-[var(--success)]/5 ring-1 ring-[var(--success)]/20"
                          : "border-[var(--border-color)] surface"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2.5">
                            {p.slug !== "bank" && <CompanyLogo slug={p.slug} size={24} />}
                            <span className="font-bold text-base text-[var(--foreground)]">{p.name}</span>
                            {isBest && (
                              <span className="rounded bg-[var(--success)]/20 border border-[var(--success)]/30 px-2 py-0.5 text-[10px] font-bold text-success-text">
                                Highest Payout
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-[var(--muted-text)]">{p.highlight}</p>
                        </div>

                        <div className="text-left sm:text-right font-mono">
                          <motion.div
                            key={`${p.name}-${Math.round(p.netPayout)}`}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="text-lg font-bold text-[var(--foreground)]"
                          >
                            {targetCurr.symbol}{Math.round(p.netPayout).toLocaleString()} {targetCurr.code}
                          </motion.div>
                          <div className="text-xs text-[var(--muted-text)]">Speed: {p.speed}</div>
                        </div>
                      </div>

                      {/* Animated payout bar */}
                      <div className="mt-3 h-2 w-full rounded-full bg-[var(--border-color)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{
                            ...animation.transition.layout,
                            duration: 0.5,
                            delay: i * 0.08,
                          }}
                          className={`h-full rounded-full ${isBest ? "bg-[var(--success)]" : "bg-[var(--accent)]"}`}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between border-t border-[var(--border-color)] pt-2 text-xs text-[var(--muted-text)]">
                        <span>Upfront Fee: <strong className="text-[var(--foreground)] font-mono">${p.fee.toFixed(2)}</strong></span>
                        <span>Exchange Markup: <strong className={p.fxMargin > 0 ? "text-warning-text font-mono" : "text-success-text font-mono"}>{p.fxMargin}%</strong></span>
                        <span>Rate: <strong className="text-[var(--foreground)] font-mono">{p.rate.toFixed(4)}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Note on estimates — referenced by the SectionHeading description ("see note below") */}
          <div className="surface rounded-xl border border-[var(--border-color)] p-4 text-xs leading-relaxed text-[var(--muted-text)]">
            <strong className="text-[var(--foreground)]">Note on estimates:</strong> Exchange rates are mid-market reference snapshots, not live quotes, and will drift over time. Provider fee models reflect publicly listed standard pricing as of Q3 2026. Traditional banks often quote an undisclosed FX markup baked into the exchange rate rather than charging a separate fee — that spread can be larger than the markup shown here. For large transfers, negotiate the rate with your bank or use Wise&apos;s mid-market rate as a benchmark.
          </div>
        </div>
      </div>
    </div>
  );
}