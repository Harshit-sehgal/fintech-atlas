"use client";

import { useEffect, useMemo, useState } from "react";
import {
  computeMarkup,
  type MarkupDirection,
} from "@/lib/markup-calculator";
import {
  encodeToolParams,
  loadToolState,
  printToPdf,
  readNumericParams,
  saveToolState,
  shareOrCopy,
} from "@/lib/share";
import { useToast } from "@/lib/toast-context";

/**
 * Exchange-rate markup calculator client island.
 *
 * Deliberately dependency-light (no framer-motion): the tool is a pair of
 * number inputs plus optional amount, so the island stays small enough that
 * the interactive value does not compete with the editorial page for budget.
 */

type MarkupState = {
  direction: MarkupDirection;
  midRate: number;
  offeredRate: number;
  amount: number;
};

const DEFAULT_STATE: MarkupState = {
  direction: "receive-inr",
  midRate: 83.5,
  offeredRate: 82,
  amount: 1000,
};

const MARKUP_KEYS = ["midRate", "offeredRate", "amount"] as const;

function isValidMarkupState(value: unknown): value is MarkupState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<MarkupState>;
  return (
    (state.direction === "receive-inr" || state.direction === "send-inr") &&
    typeof state.midRate === "number" &&
    Number.isFinite(state.midRate) &&
    state.midRate > 0 &&
    typeof state.offeredRate === "number" &&
    Number.isFinite(state.offeredRate) &&
    state.offeredRate > 0 &&
    typeof state.amount === "number" &&
    Number.isFinite(state.amount) &&
    state.amount >= 0 &&
    state.amount <= 1_000_000_000
  );
}

function readMarkupState(search: string, saved: unknown): MarkupState {
  const fromUrl = readNumericParams(search, "fx_", [...MARKUP_KEYS]);
  const urlDirection = new URLSearchParams(search).get("fx_direction");
  const urlState: Partial<MarkupState> = {
    ...fromUrl,
    ...(urlDirection === "receive-inr" || urlDirection === "send-inr"
      ? { direction: urlDirection }
      : {}),
  };
  if (isValidMarkupState(urlState)) return urlState;
  if (isValidMarkupState(saved)) return saved;
  return DEFAULT_STATE;
}

function formatInr(value: number): string {
  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export function MarkupCalculatorClient() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<MarkupState>(DEFAULT_STATE);
  const { showToast } = useToast();

  useEffect(() => {
    // Defer to a macrotask so restore runs after paint and satisfies
    // react-hooks/set-state-in-effect (client-only URL/localStorage hydrate).
    const id = window.setTimeout(() => {
      const saved = loadToolState<MarkupState>("markup_calculator");
      const initial = readMarkupState(window.location.search, saved);
      setState(initial);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const result = useMemo(() => computeMarkup(state), [state]);

  const setField = (field: keyof MarkupState, value: string) => {
    const num = value === "" ? 0 : Number(value);
    if (!Number.isFinite(num)) return;
    setState((prev) => ({ ...prev, [field]: num }));
  };

  const handleShare = async () => {
    const params = encodeToolParams("fx_", state);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
    const shared = await shareOrCopy({
      title: "Exchange-Rate Markup Calculator — FinTech Atlas",
      url,
    });
    if (shared === "shared") showToast("Shared markup estimate link", "success");
    else if (shared === "copied") showToast("Markup estimate link copied", "success");
    else showToast("Could not share or copy the link", "error");
  };

  const handleSave = () => {
    const ok = saveToolState("markup_calculator", state);
    showToast(
      ok ? "Saved on this device" : "Could not save (storage blocked or full)",
      ok ? "success" : "error",
    );
  };

  const amountLabel = state.direction === "receive-inr" ? "Amount received (USD)" : "Amount sent (INR)";
  const amountHint =
    state.direction === "receive-inr"
      ? "How many US dollars are being converted to INR."
      : "How many rupees are being converted to USD.";

  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--foreground)]">Measure the rate markup</h2>
        <div className="flex gap-2 print:hidden">
          <button type="button" onClick={handleShare} className="btn-ghost text-xs px-3 py-1.5" disabled={!hydrated}>
            Share link
          </button>
          <button type="button" onClick={handleSave} className="btn-ghost text-xs px-3 py-1.5" disabled={!hydrated}>
            Save locally
          </button>
          <button type="button" onClick={printToPdf} className="btn-ghost text-xs px-3 py-1.5">
            Save as PDF
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-sm">
              <span className="font-medium text-[var(--muted-text)]" id="fx-direction-label">Transfer direction</span>
            </div>
            <div role="radiogroup" aria-labelledby="fx-direction-label" className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "receive-inr", label: "Receiving INR", sub: "USD → INR" },
                  { value: "send-inr", label: "Sending INR", sub: "INR → USD" },
                ] as const
              ).map((option) => {
                const active = state.direction === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setState((prev) => ({ ...prev, direction: option.value }))}
                    className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent)]/10"
                        : "border-[var(--border-color)] hover:border-[var(--foreground)]"
                    }`}
                  >
                    <span className={`block text-xs font-semibold ${active ? "text-[var(--foreground)]" : "text-[var(--muted-text)]"}`}>
                      {option.label}
                    </span>
                    <span className="block text-[10px] text-[var(--muted-text)]">{option.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="fx-mid-rate" className="mb-2 block text-sm font-medium text-[var(--muted-text)]">
              Mid-market rate (₹ per US$)
            </label>
            <input
              id="fx-mid-rate"
              type="number"
              inputMode="decimal"
              min="0.0001"
              step="0.01"
              value={state.midRate || ""}
              onChange={(e) => setField("midRate", e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--muted-text)]">
              The real interbank rate (example: ₹83.50 per US$). Look it up on a rate
              aggregator the same day you check your provider&apos;s quote.
            </p>
          </div>

          <div>
            <label htmlFor="fx-offered-rate" className="mb-2 block text-sm font-medium text-[var(--muted-text)]">
              Your provider&apos;s rate (₹ per US$)
            </label>
            <input
              id="fx-offered-rate"
              type="number"
              inputMode="decimal"
              min="0.0001"
              step="0.01"
              value={state.offeredRate || ""}
              onChange={(e) => setField("offeredRate", e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--muted-text)]">
              The rate the provider shows you at checkout — including any hidden spread.
            </p>
          </div>

          <div>
            <label htmlFor="fx-amount" className="mb-2 block text-sm font-medium text-[var(--muted-text)]">
              {amountLabel} <span className="text-[var(--muted-text)]">(optional)</span>
            </label>
            <input
              id="fx-amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="100"
              value={state.amount || ""}
              onChange={(e) => setField("amount", e.target.value)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--muted-text)]">{amountHint}</p>
          </div>
        </div>

        {/* Results */}
        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-text)]">Markup vs mid-market</span>
            <span
              className={`text-2xl font-bold tabular-nums ${
                result.worseThanMid ? "text-[var(--danger, #ef4444)]" : "text-[var(--accent)]"
              }`}
            >
              {result.markupPercent.toFixed(2)}%
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--muted-text)]">
            {result.worseThanMid
              ? state.direction === "receive-inr"
                ? "You receive fewer rupees than mid-market — the gap is the provider's markup on this transfer."
                : "You pay more rupees per dollar than mid-market — the gap is the provider's markup on this transfer."
              : "The offered rate is at or better than mid-market — no rate markup on this transfer. Watch for separate fees."}
          </p>

          {state.amount > 0 && (
            <div className="mt-5 space-y-3 border-t border-[var(--border-color)] pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-text)]">Expected at mid-market</span>
                <span className="font-semibold tabular-nums text-[var(--foreground)]">
                  {state.direction === "receive-inr"
                    ? formatInr(result.expectedTarget)
                    : formatUsd(result.expectedTarget)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted-text)]">Actual at offered rate</span>
                <span className="font-semibold tabular-nums text-[var(--foreground)]">
                  {state.direction === "receive-inr"
                    ? formatInr(result.actualTarget)
                    : formatUsd(result.actualTarget)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[var(--border-color)] pt-3">
                <span className="text-[var(--muted-text)]">You lose (markup cost)</span>
                <span className="font-bold tabular-nums text-[var(--danger, #ef4444)]">
                  {result.worseThanMid
                    ? state.direction === "receive-inr"
                      ? formatInr(result.lossInr)
                      : `${formatUsd(result.lossUsd)} ≈ ${formatInr(result.lossInr)}`
                    : "—"}
                </span>
              </div>
            </div>
          )}

          <div className="mt-5 rounded-lg border border-[var(--border-color)] bg-[var(--card)] p-3 text-[11px] leading-relaxed text-[var(--muted-text)]">
            The markup percentage is the same regardless of amount — it is the
            hidden spread. Add any upfront transfer fee on top to get the total
            cost. Rates are user-entered; this tool never claims to know today&apos;s
            market rate.
          </div>
        </div>
      </div>
    </div>
  );
}
