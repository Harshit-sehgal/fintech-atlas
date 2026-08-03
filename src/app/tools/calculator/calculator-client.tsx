"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { CompanyLogo } from "@/components/ui/company-logo";
import {
  DEFAULT_MONTHLY_REVENUE,
  DEFAULT_AVG_ORDER_VALUE,
  DEFAULT_INTL_PERCENT,
  DEFAULT_IN_PERSON_PERCENT,
  PROVIDER_FEE_CONFIGS,
} from "@/data/fee-calculator-config";
import {
  computeProviderCosts,
  FeeInputs,
} from "@/lib/fee-calculator";

export default function FeeCalculatorPageClient() {
  const [monthlyRevenue, setMonthlyRevenue] =
    useState<number>(DEFAULT_MONTHLY_REVENUE);
  const [avgOrderValue, setAvgOrderValue] =
    useState<number>(DEFAULT_AVG_ORDER_VALUE);
  const [intlPercent, setIntlPercent] =
    useState<number>(DEFAULT_INTL_PERCENT);
  const [inPersonPercent, setInPersonPercent] =
    useState<number>(DEFAULT_IN_PERSON_PERCENT);

  const inputs: FeeInputs = {
    monthlyRevenue,
    avgOrderValue,
    intlPercent,
    inPersonPercent,
  };

  const providers = computeProviderCosts(PROVIDER_FEE_CONFIGS, inputs);
  const lowestCost = providers[0];

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

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* Input Controls */}
        <div className="surface lg:col-span-5 space-y-6 rounded-2xl border border-[var(--border-color)] p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)] border-b border-[var(--border-color)] pb-3">
            Business Parameters
          </h2>

          {/* Monthly Revenue */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="slider-monthly-revenue" className="font-medium text-[var(--muted-text)]">Monthly Processing Volume</label>
              <span className="font-mono font-bold text-[var(--foreground)]">${monthlyRevenue.toLocaleString()}</span>
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
              <span>$1k</span>
              <span>$250k</span>
              <span>$500k</span>
            </div>
          </div>

          {/* Average Order Value */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="slider-aov" className="font-medium text-[var(--muted-text)]">Average Order Value (AOV)</label>
              <span className="font-mono font-bold text-[var(--foreground)]">${avgOrderValue}</span>
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
              <span>$5 (Micropayments)</span>
              <span>$50</span>
              <span>$500</span>
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
                (monthlyRevenue * (1 - intlPercent / 100)).toLocaleString()
              }</span>
            </div>
            <div className="flex justify-between text-[var(--muted-text)]">
              <span>International Volume:</span>
              <span className="font-mono font-semibold text-[var(--foreground)]">{
                (monthlyRevenue * (intlPercent / 100)).toLocaleString()
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
                    {lowestCost.name} is estimated lowest cost
                  </h3>
                </div>
                <div className="rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/30 px-4 py-2 text-right">
                  <div className="text-xs text-success-text">Lowest Est. Monthly Cost</div>
                  <div className="text-xl font-bold font-mono text-success-text">
                    ${Math.round(lowestCost.cost).toLocaleString()}
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
                  const maxCost = Math.max(...providers.map((x) => x.cost));
                  const barWidth = maxCost > 0 ? (p.cost / maxCost) * 100 : 0;

                  return (
                    <div key={p.slug} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2.5">
                          <CompanyLogo slug={p.slug} size={24} />
                          <Link href={`/companies/${p.slug}`} className="font-bold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
                            {p.name}
                          </Link>
                          {isBest && (
                            <span className="rounded bg-[var(--success)]/20 border border-[var(--success)]/30 px-2 py-0.5 text-[10px] font-bold text-success-text">
                              Lowest Fee
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 font-mono text-xs">
                          <span className="text-[var(--muted-text)]">Effective {effectiveRate}%</span>
                          <span className="font-bold text-[var(--foreground)]">${Math.round(p.cost).toLocaleString()}/mo</span>
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
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Important context notice */}
          <div className="surface rounded-xl border border-[var(--border-color)] p-4 text-xs leading-relaxed text-[var(--muted-text)]">
            <strong className="text-[var(--foreground)]">Note on estimates:</strong> Standard published card-not-present rates are used (Stripe 2.9%+$0.30, PayPal 3.49%+$0.49, Square 2.9%+$0.30). Adyen is modeled as a blended total-volume estimate, so the online/in-person and international mix controls do not change its result. Once you cross $80k+/month in processing, custom enterprise volume pricing and interchange++ billing can significantly lower these numbers.
          </div>
        </div>
      </div>
    </div>
  );
}