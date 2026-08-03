"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { useToast } from "@/lib/toast-context";
import {
  downloadCsv,
  encodeToolParams,
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

const ACCENTS = [
  "#6366f1", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#f97316", "#ef4444", "#06b6d4", "#22c55e",
];

function defaultValuesFor(calc: (typeof CALCULATORS)[number]): CalcValues {
  return calc.inputs.reduce<CalcValues>((acc, input) => {
    acc[input.key] = input.default;
    return acc;
  }, {});
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
      const fromUrl = readNumericParams(
        window.location.search,
        `${calc.id}_`,
        calc.inputs.map((i) => i.key),
      );
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
      const saved = loadToolState<CalcValues>(`calc_${calc.id}`);
      if (saved) nextValues[calc.id] = { ...nextValues[calc.id], ...saved };
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
  const activeValues = valuesByCalc[activeCalc.id];
  const accent = ACCENTS[CALCULATORS.findIndex((c) => c.id === activeCalc.id) % ACCENTS.length];
  const outputs = activeCalc.compute(activeValues);

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
    <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
      <GridBackdrop />

      <div className="mb-6 flex items-center gap-2 text-xs text-[var(--muted-text)] font-mono">
        <Link href="/tools" className="hover:text-[var(--foreground)] transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-medium">Personal Finance Calculators</span>
      </div>

      <SectionHeading
        headingLevel={1}
        eyebrow="Financial Planning Suite"
        title="Personal Finance Calculators"
        description="Quick, illustrative calculators for investing, loans, inflation, retirement, and net worth. Results are educational estimates — not financial advice."
      />

      <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Choose a calculator">
        {CALCULATORS.map((calc, index) => {
          const active = calc.id === activeCalc.id;
          const cAccent = ACCENTS[index % ACCENTS.length];
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
              style={active ? ({ background: cAccent } as CSSProperties) : undefined}
            >
              <span className="text-base">{calc.icon}</span>
              <span className="font-medium">{calc.name}</span>
            </button>
          );
        })}
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
          transition={{ duration: 0.25 }}
          style={{ ["--accent"]: accent } as CSSProperties}
          className="mt-8 grid gap-8 lg:grid-cols-12"
        >
          <div className="surface rounded-2xl border border-[var(--border-color)] p-6 lg:col-span-5 print:break-inside-avoid">
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
            <div className="surface rounded-2xl border border-[var(--border-color)] p-6 print:break-inside-avoid">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
                <span className="eyebrow text-[var(--muted-text)]">Results</span>
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
