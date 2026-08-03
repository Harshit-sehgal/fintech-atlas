"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { CompanyLogo } from "@/components/ui/company-logo";
import { useToast } from "@/lib/toast-context";
import {
  downloadCsv,
  encodeToolParams,
  printToPdf,
  loadToolState,
  readNumericParams,
  saveToolState,
  shareOrCopy,
} from "@/lib/share";
import {
  DEFAULT_MONTHLY_REVENUE,
  DEFAULT_AVG_ORDER_VALUE,
  DEFAULT_INTL_PERCENT,
  DEFAULT_IN_PERSON_PERCENT,
  DEFAULT_FEE_CURRENCY,
  PROVIDER_FEE_CONFIGS,
} from "@/data/fee-calculator-config";
import type { FeeCurrency } from "@/data/fee-calculator-config";
import {
  computeProviderCosts,
  type FeeInputs,
} from "@/lib/fee-calculator";
import { PartnerCta } from "@/components/ui/partner-cta";

type FeeState = {
  monthlyRevenue: number;
  avgOrderValue: number;
  intlPercent: number;
  inPersonPercent: number;
  currency: FeeCurrency;
};

const FEE_KEYS = [
  "monthlyRevenue",
  "avgOrderValue",
  "intlPercent",
  "inPersonPercent",
] as const;

function isValidFeeState(value: unknown): value is FeeState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<FeeState>;
  return (
    typeof state.monthlyRevenue === "number" && Number.isFinite(state.monthlyRevenue) && state.monthlyRevenue >= 1_000 && state.monthlyRevenue <= 500_000 &&
    typeof state.avgOrderValue === "number" && Number.isFinite(state.avgOrderValue) && state.avgOrderValue >= 5 && state.avgOrderValue <= 500 &&
    typeof state.intlPercent === "number" && Number.isFinite(state.intlPercent) && state.intlPercent >= 0 && state.intlPercent <= 100 &&
    typeof state.inPersonPercent === "number" && Number.isFinite(state.inPersonPercent) && state.inPersonPercent >= 0 && state.inPersonPercent <= 100 &&
    (state.currency === "USD" || state.currency === "INR")
  );
}

function readFeeCurrency(search: string, saved: unknown): FeeCurrency {
  const fromUrl = new URLSearchParams(search).get("fee_currency");
  if (fromUrl === "USD" || fromUrl === "INR") return fromUrl;
  const savedCurrency = (saved as Partial<FeeState> | null)?.currency;
  return savedCurrency === "USD" || savedCurrency === "INR"
    ? savedCurrency
    : DEFAULT_FEE_CURRENCY;
}

function readFeeState(search: string, saved: unknown): FeeState | null {
  const currency = readFeeCurrency(search, saved);
  const fromUrl = readNumericParams(search, "fee_", [...FEE_KEYS]);
  const urlState = { ...fromUrl, currency } as Partial<FeeState>;
  if (isValidFeeState(urlState)) return urlState;
  if (!isValidFeeState(saved)) return null;
  return { ...(saved as FeeState), currency };
}

/** Round to whole units and format in the active currency's grouping (₹ lakhs vs $ commas). */
function formatFeeMoney(value: number, currency: FeeCurrency): string {
  const symbol = currency === "INR" ? "₹" : "$";
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return `${symbol}${Math.round(value).toLocaleString(locale)}`;
}

export default function FeeCalculatorPageClient() {
  const { showToast } = useToast();
  const [monthlyRevenue, setMonthlyRevenue] =
    useState<number>(DEFAULT_MONTHLY_REVENUE);
  const [avgOrderValue, setAvgOrderValue] =
    useState<number>(DEFAULT_AVG_ORDER_VALUE);
  const [intlPercent, setIntlPercent] =
    useState<number>(DEFAULT_INTL_PERCENT);
  const [inPersonPercent, setInPersonPercent] =
    useState<number>(DEFAULT_IN_PERSON_PERCENT);
  const [currency, setCurrency] = useState<FeeCurrency>(DEFAULT_FEE_CURRENCY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadToolState<unknown>("fee_calculator");
    const source = readFeeState(window.location.search, saved);
    // Defer to a macrotask so restore runs after paint and satisfies
    // react-hooks/set-state-in-effect (client-only URL/localStorage hydrate).
    const id = window.setTimeout(() => {
      if (source) {
        if (typeof source.monthlyRevenue === "number") setMonthlyRevenue(source.monthlyRevenue);
        if (typeof source.avgOrderValue === "number") setAvgOrderValue(source.avgOrderValue);
        if (typeof source.intlPercent === "number") setIntlPercent(source.intlPercent);
        if (typeof source.inPersonPercent === "number") setInPersonPercent(source.inPersonPercent);
      }
      setCurrency(readFeeCurrency(window.location.search, saved));
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const inputs: FeeInputs = {
    monthlyRevenue,
    avgOrderValue,
    intlPercent,
    inPersonPercent,
    currency,
  };
  const providers = computeProviderCosts(PROVIDER_FEE_CONFIGS, inputs);

  const comparableProviders = providers.filter((provider) => provider.pricingModel === "published-flat-rate");
  const lowestCost = comparableProviders[0] ?? providers[0];
  const maxCost = Math.max(...providers.map((provider) => provider.cost));

  const currentState: FeeState = {
    monthlyRevenue,
    avgOrderValue,
    intlPercent,
    inPersonPercent,
    currency,
  };

  const handleShare = async () => {
    const params = encodeToolParams("fee_", currentState);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
    const result = await shareOrCopy({
      title: "Payment Gateway Fee Calculator — FinTech Atlas",
      url,
    });
    if (result === "shared") showToast("Shared fee estimate link", "success");
    else if (result === "copied") showToast("Fee estimate link copied", "success");
    else showToast("Could not share or copy the link", "error");
  };

  const handleSave = () => {
    const ok = saveToolState("fee_calculator", currentState);
    showToast(
      ok ? "Saved on this device" : "Could not save (storage blocked or full)",
      ok ? "success" : "error",
    );
  };

  const handlePrintPdf = () => {
    if (printToPdf()) showToast("Print dialog opened — choose Save as PDF", "success");
  };

  const handleExportCsv = () => {
    downloadCsv("fintech-atlas-fee-calculator.csv", [
      ["Field", "Value"],
      ["Currency", currency],
      ["Monthly revenue", String(monthlyRevenue)],
      ["Average order value", String(avgOrderValue)],
      ["International %", String(intlPercent)],
      ["In-person %", String(inPersonPercent)],
      ...providers.map((p) => [p.name, `${p.currency === "INR" ? "₹" : "$"}${String(Math.round(p.cost))}`]),
    ]);
    showToast("CSV downloaded", "success");
  };

  return (
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <div className="mb-6 flex items-center gap-2 text-xs text-[var(--muted-text)] font-mono">
        <Link href="/tools" className="hover:text-[var(--foreground)] transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium">Payment Gateway Fee Calculator</span>
      </div>

      <SectionHeading
        headingLevel={1}
        eyebrow="Cost Estimator"
        title="Payment Gateway Fee Calculator"
        description="Adjust your monthly revenue, order size, and sales mix to estimate transaction fees across leading payment providers."
      />

      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        <button type="button" onClick={handleShare} className="btn-ghost text-xs px-3 py-1.5" disabled={!hydrated}>
          Share link
        </button>
        <button type="button" onClick={handleSave} className="btn-ghost text-xs px-3 py-1.5" disabled={!hydrated}>
          Save locally
        </button>
        <button type="button" onClick={handleExportCsv} className="btn-ghost text-xs px-3 py-1.5">
          Export CSV
        </button>
        <button type="button" onClick={handlePrintPdf} className="btn-ghost text-xs px-3 py-1.5">
          Save as PDF
        </button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Input Controls */}
        <div className="surface lg:col-span-5 space-y-6 rounded-2xl border border-[var(--border-color)] p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)] border-b border-[var(--border-color)] pb-3">
            Business Parameters
          </h2>

          {/* Currency / Region toggle */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-[var(--muted-text)]" id="fee-currency-label">Currency / Region</span>
            </div>
            <div role="radiogroup" aria-labelledby="fee-currency-label" className="grid grid-cols-2 gap-2">
              {(["USD", "INR"] as const).map((c) => {
                const active = currency === c;
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setCurrency(c)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--foreground)]"
                        : "border-[var(--border-color)] text-[var(--muted-text)] hover:border-[var(--foreground)]"
                    }`}
                  >
                    {c === "USD" ? "USD — US providers" : "INR — India providers"}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-[var(--muted-text)]">
              Amounts are in the selected currency. India schedules add the published 18% GST on top of the platform fee.
            </p>
          </div>

          {/* Monthly Revenue */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="slider-monthly-revenue" className="font-medium text-[var(--muted-text)]">Monthly Processing Volume</label>
              <span className="font-mono font-bold text-[var(--foreground)]">{formatFeeMoney(monthlyRevenue, currency)}</span>
            </div>
            <input
              id="slider-monthly-revenue"
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[var(--muted-text)] mt-1 font-mono">
              <span>{currency === "INR" ? "₹" : "$"}1k</span>
              <span>{currency === "INR" ? "₹" : "$"}250k</span>
              <span>{currency === "INR" ? "₹" : "$"}500k</span>
            </div>
          </div>

          {/* Average Order Value */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="slider-aov" className="font-medium text-[var(--muted-text)]">Average Order Value (AOV)</label>
              <span className="font-mono font-bold text-[var(--foreground)]">{formatFeeMoney(avgOrderValue, currency)}</span>
            </div>
            <input
              id="slider-aov"
              type="range"
              min="5"
              max="500"
              step="5"
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(Number(e.target.value))}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[var(--muted-text)] mt-1 font-mono">
              <span>{currency === "INR" ? "₹" : "$"}5 (Micropayments)</span>
              <span>{currency === "INR" ? "₹" : "$"}50</span>
              <span>{currency === "INR" ? "₹" : "$"}500</span>
            </div>
          </div>

          {/* International Mix */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="slider-intl" className="font-medium text-[var(--muted-text)]">International Cards %</label>
              <span className="font-mono font-bold text-[var(--foreground)]">{intlPercent}%</span>
            </div>
            <input
              id="slider-intl"
              type="range"
              min="0"
              max="100"
              step="5"
              value={intlPercent}
              onChange={(e) => setIntlPercent(Number(e.target.value))}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
          </div>

          <p className="-mt-3 text-[11px] leading-relaxed text-[var(--muted-text)]">
            Simplified model: international adjustments apply to online transactions only; the independent POS slider does not add a separate cross-border surcharge.
          </p>

          {/* In-Person vs Online */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="slider-in-person" className="font-medium text-[var(--muted-text)]">In-Person POS Sales %</label>
              <span className="font-mono font-bold text-[var(--foreground)]">{inPersonPercent}%</span>
            </div>
            <input
              id="slider-in-person"
              type="range"
              min="0"
              max="100"
              step="5"
              value={inPersonPercent}
              onChange={(e) => setInPersonPercent(Number(e.target.value))}
              className="w-full accent-[var(--accent)] cursor-pointer"
            />
          </div>

          {/* Summary stats */}
          <div className="surface rounded-xl border border-[var(--border-color)] p-4 space-y-2 text-xs">
            <div className="flex justify-between text-[var(--muted-text)]">
              <span>Estimated Monthly Transactions:</span>
              <span className="font-mono font-semibold text-[var(--foreground)]">{
                avgOrderValue > 0 ? Math.round(monthlyRevenue / avgOrderValue).toLocaleString() : "0"
              }</span>
            </div>
            <div className="flex justify-between text-[var(--muted-text)]">
              <span>Domestic Volume:</span>
              <span className="font-mono font-semibold text-[var(--foreground)]">{
                formatFeeMoney(monthlyRevenue * (1 - intlPercent / 100), currency)
              }</span>
            </div>
            <div className="flex justify-between text-[var(--muted-text)]">
              <span>International Volume:</span>
              <span className="font-mono font-semibold text-[var(--foreground)]">{
                formatFeeMoney(monthlyRevenue * (intlPercent / 100), currency)
              }</span>
            </div>
          </div>
        </div>

        {/* Results & Bar Comparison */}
        <div className="lg:col-span-7 space-y-6">
          <Reveal>
            <div className="surface rounded-2xl border border-[var(--border-color)] p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                <div>
                  <span className="eyebrow text-[var(--muted-text)]">Recommendation</span>
                  <h3 className="mt-1 text-lg font-bold text-[var(--foreground)]">
                    {lowestCost.name} has the lowest estimate among comparable published rates
                  </h3>
                </div>
                <div className="rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/30 px-4 py-2 text-right">
                  <div className="text-xs text-success-text">Lowest Est. Monthly Cost</div>
                  <div className="text-xl font-bold font-mono text-success-text">
                    {formatFeeMoney(lowestCost.cost, currency)}
                  </div>
                </div>
              </div>

              {/* Providers list & Bar visualization */}
              <div className="mt-6 space-y-5">
                {providers.map((p, i) => {
                  const effectiveRate = monthlyRevenue > 0
                    ? ((p.cost / monthlyRevenue) * 100).toFixed(2)
                    : "0.00";
                  const isBest = p.slug === lowestCost.slug;
                  const barWidth = maxCost > 0 ? (p.cost / maxCost) * 100 : 0;

                  return (
                    <div key={`${p.currency}-${p.slug}`} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2.5">
                          <CompanyLogo slug={p.slug} name={p.name} size={24} />
                          <Link href={`/companies/${p.slug}`} className="font-bold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
                            {p.name}
                          </Link>
                          {isBest && (
                            <span className="rounded bg-[var(--success)]/20 border border-[var(--success)]/30 px-2 py-0.5 text-[10px] font-bold text-success-text">
                              Lowest comparable estimate
                            </span>
                          )}
                          {p.pricingModel !== "published-flat-rate" && (
                            <span className="rounded bg-[var(--warning)]/10 border border-[var(--warning)]/30 px-2 py-0.5 text-[10px] font-semibold text-warning-text">
                              {p.pricingModel === "custom-contract" ? "Custom contract" : "Illustrative estimate"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 font-mono text-xs">
                          <span className="text-[var(--muted-text)]">Effective {effectiveRate}%</span>
                          <span className="font-bold text-[var(--foreground)]">{formatFeeMoney(p.cost, currency)}/mo</span>
                        </div>
                      </div>

                      {/* Brand-colored bar — uses the provider's actual logo hex */}
                      <div className="h-3 w-full rounded-full bg-[var(--border-color)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{ background: isBest ? "#10b981" : p.logo }}
                        />
                      </div>
                      <p className="text-[11px] text-[var(--muted-text)]">{p.note}</p>
                      <div className="mt-2">
                        <PartnerCta
                          slug={p.slug}
                          placement="fee-calculator"
                          label={`Visit ${p.name}`}
                          variant="compact"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Important context notice */}
          <div className="surface rounded-xl border border-[var(--border-color)] p-4 text-xs leading-relaxed text-[var(--muted-text)]">
            <strong className="text-[var(--foreground)]">How to read this:</strong> Stripe, PayPal, and Square use the published flat-rate assumptions shown above. Adyen is a custom-contract provider represented by an illustrative blended estimate, so it is shown for context but not used for the comparable-rate recommendation. In India mode, Razorpay and Stripe (India) use their published domestic rates with 18% GST added on top. Actual pricing varies by region, payment method, volume, and contract; verify current terms before making a decision.
          </div>
        </div>
      </div>
    </div>
  );
}