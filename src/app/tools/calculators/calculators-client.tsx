"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { useToast } from "@/lib/toast-context";
import { trackEvent } from "@/lib/analytics";
import { useToolStart } from "@/lib/use-tool-start";
import {
  downloadCsv,
  encodeToolParams,
  printToPdf,
  loadToolState,
  readNumericParams,
  saveToolState,
  shareOrCopy,
} from "@/lib/share";
import CALCULATORS, {
  formatMoney,
  formatPercent,
  formatYears,
  type CalcInput,
  type CalcValues,
} from "@/data/calculator-config";

// Accents are theme-aware CSS variables (globals.css): deep AA-safe shades
// in light theme, light twins in dark. Both clear 4.5:1 as text on
// --surface/--card and as active-tab backgrounds under the theme ink.
const ACCENT_VARS = [
  "--acc-0", "--acc-1", "--acc-2", "--acc-3", "--acc-4",
  "--acc-5", "--acc-6", "--acc-7", "--acc-8",
];

// Group the calculator strip by the life decision it serves, so users pick by
// intent ("Plan & grow investments") instead of scanning a horizontal row.
const CALC_CLUSTERS: { id: string; title: string; blurb: string; calcIds: string[] }[] = [
  { id: "invest", title: "Plan & grow investments", blurb: "Project returns and compound growth.", calcIds: ["sip", "swp", "cagr"] },
  { id: "retire", title: "Retirement & FIRE", blurb: "Corpus, drawdown and early-retirement math.", calcIds: ["retirement", "fire"] },
  { id: "debt", title: "Borrow & inflation", blurb: "Loan costs and purchasing-power erosion.", calcIds: ["emi", "inflation"] },
  { id: "net", title: "Wealth & safety net", blurb: "Net worth and emergency buffers.", calcIds: ["emergency", "networth"] },
];

function defaultValuesFor(calc: (typeof CALCULATORS)[number]): CalcValues {
  return calc.inputs.reduce<CalcValues>((acc, input) => {
    acc[input.key] = input.default;
    return acc;
  }, {});
}

function validCalcValue(input: CalcInput, value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= input.min && value <= input.max;
}

function isValidCalcState(
  calc: (typeof CALCULATORS)[number],
  value: unknown,
): value is CalcValues {
  if (!value || typeof value !== "object") return false;
  const state = value as Record<string, unknown>;
  return calc.inputs.every((input) => validCalcValue(input, state[input.key]));
}

function readCalcOverrides(
  calc: (typeof CALCULATORS)[number],
  search: string,
): Partial<CalcValues> {
  const parsed = readNumericParams(search, `${calc.id}_`, calc.inputs.map((input) => input.key));
  return Object.fromEntries(
    Object.entries(parsed).filter(([key, value]) => {
      const input = calc.inputs.find((candidate) => candidate.key === key);
      return input && validCalcValue(input, value);
    }),
  ) as Partial<CalcValues>;
}

function formatInputValue(input: CalcInput, value: number): string {
  switch (input.kind) {
    case "currency":
      return formatMoney(value);
    case "percent":
      return formatPercent(value);
    case "years":
      return formatYears(value);
    default:
      return value.toLocaleString();
  }
}

export default function CalculatorsClient() {
  const { showToast } = useToast();
  const rootRef = useRef<HTMLDivElement>(null);
  useToolStart("calculators", rootRef);
  const [activeId, setActiveId] = useState<string>(CALCULATORS[0].id);
  const [valuesByCalc, setValuesByCalc] = useState<Record<string, CalcValues>>(
    () =>
      CALCULATORS.reduce<Record<string, CalcValues>>((acc, calc) => {
        acc[calc.id] = defaultValuesFor(calc);
        return acc;
      }, {}),
  );
  const [hydrated, setHydrated] = useState(false);

  // Restore from URL (?calc=&…) then localStorage once on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const calcFromUrl = params.get("calc");
    const nextValues: Record<string, CalcValues> = CALCULATORS.reduce(
      (acc, calc) => {
        acc[calc.id] = defaultValuesFor(calc);
        return acc;
      },
      {} as Record<string, CalcValues>,
    );
    let nextActive = CALCULATORS[0].id;

    if (calcFromUrl && CALCULATORS.some((c) => c.id === calcFromUrl)) {
      nextActive = calcFromUrl;
    }

    for (const calc of CALCULATORS) {
      const fromUrl = readCalcOverrides(calc, window.location.search);
      if (Object.keys(fromUrl).length > 0) {
        // fromUrl is a partial numeric override of this calc's input keys; the
        // calc's defaults (number for every key) already cover the rest, so the
        // spread is always a complete CalcValues at runtime.
        nextValues[calc.id] = {
          ...nextValues[calc.id],
          ...(fromUrl as CalcValues),
        };
        continue;
      }
      const saved = loadToolState<unknown>(`calc_${calc.id}`);
      if (isValidCalcState(calc, saved)) nextValues[calc.id] = saved;
    }

    // Defer to a macrotask so restore runs after paint and satisfies
    // react-hooks/set-state-in-effect (client-only URL/localStorage hydrate).
    const id = window.setTimeout(() => {
      setActiveId(nextActive);
      setValuesByCalc(nextValues);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const activeCalc =
    CALCULATORS.find((c) => c.id === activeId) ?? CALCULATORS[0];
  const activeValues = valuesByCalc[activeCalc.id] ?? defaultValuesFor(activeCalc);
  const accent = ACCENT_VARS[CALCULATORS.findIndex((c) => c.id === activeCalc.id) % ACCENT_VARS.length];
  const outputs = activeCalc.compute(activeValues);

  // Fire one completion event when a calculator becomes ready. `outputs` is
  // intentionally excluded: compute() returns a new array on every slider
  // render, and a slider change is not a new completed session.
  useEffect(() => {
    if (hydrated) {
      trackEvent("tool_complete", {
        tool: "calculator",
        calc_id: activeCalc.id,
      });
    }
  }, [hydrated, activeCalc.id]);

  const setValue = (calcId: string, key: string, value: number) => {
    setValuesByCalc((prev) => ({
      ...prev,
      [calcId]: { ...prev[calcId], [key]: value },
    }));
  };

  const buildShareUrl = () => {
    const params = encodeToolParams(`${activeCalc.id}_`, activeValues);
    params.set("calc", activeCalc.id);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const handleShare = async () => {
    const url = buildShareUrl();
    window.history.replaceState(null, "", url);
    const result = await shareOrCopy({
      title: `${activeCalc.name} — FinTech Atlas`,
      text: "Illustrative calculator result from FinTech Atlas",
      url,
    });
    if (result === "shared") showToast("Shared calculator link", "success");
    else if (result === "copied") showToast("Calculator link copied", "success");
    else showToast("Could not share or copy the link", "error");
  };

  const handleSave = () => {
    const ok = saveToolState(`calc_${activeCalc.id}`, activeValues);
    showToast(
      ok ? "Saved on this device" : "Could not save (storage blocked or full)",
      ok ? "success" : "error",
    );
  };

  const handlePrintPdf = () => {
    if (printToPdf()) showToast("Print dialog opened — choose Save as PDF", "success");
  };

  const handleExportCsv = () => {
    const rows: string[][] = [
      ["Field", "Value"],
      ["Calculator", activeCalc.name],
      ...activeCalc.inputs.map((input) => [
        input.label,
        String(activeValues[input.key]),
      ]),
      ...outputs.map((output) => [output.label, output.value ?? ""]),
    ];
    downloadCsv(`fintech-atlas-${activeCalc.id}.csv`, rows);
    showToast("CSV downloaded", "success");
  };

  return (
    <div ref={rootRef} className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--muted-text)] font-mono">
        <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-[var(--foreground)] transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium">Personal Finance Calculators</span>
      </nav>

      <SectionHeading
        headingLevel={1}
        eyebrow="Financial Planning Suite"
        title="Personal Finance Calculators"
        description="Quick, illustrative calculators for investing, loans, inflation, retirement, and net worth. Results are educational estimates — not financial advice."
      />

      <div className="mt-10 space-y-7" role="tablist" aria-label="Choose a calculator">
        {CALC_CLUSTERS.map((cluster) => (
          <div key={cluster.id}>
            <div className="mb-3 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                {cluster.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted-text)]">{cluster.blurb}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {cluster.calcIds.map((id) => {
                const calc = CALCULATORS.find((c) => c.id === id);
                if (!calc) return null;
                const active = calc.id === activeCalc.id;
                const index = CALCULATORS.findIndex((c) => c.id === calc.id);
                const cAccent = ACCENT_VARS[index % ACCENT_VARS.length];
                return (
                  <button
                    key={calc.id}
                    role="tab"
                    id={`tab-${calc.id}`}
                    aria-selected={active}
                    aria-controls={`panel-${calc.id}`}
                    onClick={() => setActiveId(calc.id)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
                      active
                        ? "border-transparent text-[var(--background)]"
                        : "border-[var(--border-color)] text-[var(--muted-text)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                    }`}
                    style={active ? ({ background: `var(${cAccent})` } as CSSProperties) : undefined}
                  >
                    {/* Editorial index numeral instead of an emoji marker (P1-1) */}
                    <span aria-hidden className="font-mono text-xs font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium">{calc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCalc.id}
          id={`panel-${activeCalc.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCalc.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          style={{ ["--accent"]: `var(${accent})` } as CSSProperties}
          className="mt-8 grid gap-8 lg:grid-cols-12"
        >
          <div className="surface rounded-lg border border-[var(--border-color)] p-6 lg:col-span-5 print:break-inside-avoid">
            <div className="border-b border-[var(--border-color)] pb-3">
              <h2 className="text-base font-semibold text-[var(--foreground)]">{activeCalc.name}</h2>
              <p className="mt-1 text-xs text-[var(--muted-text)]">{activeCalc.tagline}</p>
            </div>

            <div className="mt-6 space-y-6">
              {activeCalc.inputs.map((input) => (
                <div key={input.key}>
                  <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
                    <label htmlFor={`${activeCalc.id}-${input.key}`} className="font-medium text-[var(--muted-text)]">
                      {input.label}
                    </label>
                    <span className="font-mono font-bold text-[var(--foreground)]">
                      {formatInputValue(input, activeValues[input.key])}
                    </span>
                  </div>
                  <input
                    id={`${activeCalc.id}-${input.key}`}
                    type="range"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={activeValues[input.key]}
                    onChange={(e) => setValue(activeCalc.id, input.key, Number(e.target.value))}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                    aria-label={input.label}
                  />
                  <div className="mt-1 flex justify-between text-[11px] font-mono text-[var(--muted-text)]">
                    <span>{formatInputValue(input, input.min)}</span>
                    <span>{formatInputValue(input, input.max)}</span>
                  </div>
                  {input.hint && (
                    <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted-text)]">{input.hint}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <div className="surface rounded-lg border border-[var(--border-color)] p-6 print:break-inside-avoid">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
                <span className="eyebrow !text-[var(--muted-text)]">Results</span>
                <div className="flex flex-wrap gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="btn-ghost text-xs px-3 py-1.5"
                    disabled={!hydrated}
                  >
                    Share link
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="btn-ghost text-xs px-3 py-1.5"
                    disabled={!hydrated}
                  >
                    Save locally
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="btn-ghost text-xs px-3 py-1.5"
                  >
                    Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="btn-ghost text-xs px-3 py-1.5"
                  >
                    Save as PDF
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {outputs.map((output) => {
                  const isWarning = output.kind === "warning";
                  const isPrimary = output.kind === "currency" && output === outputs[outputs.length - 1];
                  return (
                    <div
                      key={output.label}
                      className={`rounded-xl border p-4 ${
                        isWarning
                          ? "border-[var(--warning)]/40 bg-[var(--warning)]/10"
                          : isPrimary
                          ? "border-[var(--success)]/40 bg-[var(--success)]/10"
                          : "border-[var(--border-color)] surface"
                      }`}
                    >
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-text)]">
                        {output.label}
                      </div>
                      <div
                        className={`mt-1.5 font-mono text-xl font-bold ${
                          isWarning ? "text-warning-text" : isPrimary ? "text-success-text" : "text-[var(--foreground)]"
                        }`}
                      >
                        {output.value ?? "—"}
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeCalc.id === "networth" && (
                <p className="mt-4 text-xs leading-relaxed text-[var(--muted-text)]">
                  A debt-to-assets ratio above ~0.4–0.5 is considered leveraged; ratios vary widely by life stage. This is a
                  point-in-time snapshot — values change as markets and payments move.
                </p>
              )}
            </div>

            <div className="surface rounded-xl border border-[var(--border-color)] p-4 text-xs leading-relaxed text-[var(--muted-text)]">
              <strong className="text-[var(--foreground)]">How to read this:</strong> These are simplified, illustrative models.
              They do not account for taxes, fund fees, transaction costs, inflation-adjusted contributions, or the variability of
              actual returns. Results should be used for orientation and planning only — verify with a qualified financial advisor
              before making decisions.
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
