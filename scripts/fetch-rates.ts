/**
 * Live FX-rate snapshot refresher for the remittance calculator.
 *
 * Pulls ECB reference rates (USD base) via the Frankfurter API and rewrites
 * the snapshot block in `src/data/remittance-config.ts` — the same block that
 * `check-rate-snapshot.mjs` gates the build on (max age 7 days). Replaces the
 * manual chore of hand-editing rates every week.
 *
 * Guards:
 *  - every expected currency must come back positive and finite;
 *  - each new rate must stay within one order of magnitude of the previous
 *    value (catches API garbage / wrong-base responses before they ship);
 *  - config anchors are matched exactly — if the file structure drifts the
 *    script fails loudly instead of writing a partial update.
 *
 * Run via `npm run rates:fetch`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CONFIG_PATH = resolve(process.cwd(), "src/data/remittance-config.ts");
const RATES_URL =
  "https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,GBP,INR,CAD,AUD,BRL,JPY";

export const EXPECTED_CURRENCIES = ["EUR", "GBP", "INR", "CAD", "AUD", "BRL", "JPY"] as const;

export interface RatesPayload {
  date: string;
  base: string;
  rates: Record<string, number>;
}

/** Parse + validate the Frankfurter response body. Throws on any anomaly. */
export function parseRatesResponse(body: string): { date: string; rates: Record<string, number> } {
  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    throw new Error("Frankfurter response is not valid JSON");
  }
  const payload = json as Partial<RatesPayload>;
  if (!payload || typeof payload !== "object") {
    throw new Error("Frankfurter response shape unexpected");
  }
  if (payload.base !== "USD") {
    throw new Error(`Expected USD-base rates, got base=${String(payload.base)}`);
  }
  const date = typeof payload.date === "string" ? payload.date : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Frankfurter returned an unusable date: ${String(payload.date)}`);
  }
  const rates: Record<string, number> = {};
  for (const code of EXPECTED_CURRENCIES) {
    const value = payload.rates?.[code];
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
      throw new Error(`Missing or invalid rate for ${code}: ${String(value)}`);
    }
    rates[code] = value;
  }
  return { date, rates };
}

/** Round for display: 4 significant figures keeps the file readable. */
export function formatRate(value: number): string {
  return String(Number(value.toPrecision(4)));
}

/**
 * Rewrite the snapshot constants + per-currency rates inside the config
 * source. Anchored replacements — any missing anchor means the config
 * structure changed and the function throws instead of guessing.
 */
export function applyRatesToConfig(
  source: string,
  date: string,
  rates: Record<string, number>,
): string {
  let next = source;

  next = replaceAnchor(
    next,
    /export const RATES_AS_OF = "[^"]+";/,
    `export const RATES_AS_OF = "${date}T00:00:00.000Z";`,
  );
  next = replaceAnchor(
    next,
    /export const RATES_SOURCE = "[^"]+";/,
    `export const RATES_SOURCE = "ECB reference rates (USD base), ${date}";`,
  );

  for (const code of EXPECTED_CURRENCIES) {
    const pattern = new RegExp(
      `(\\{ code: "${code}"[^}]*?rate: )([0-9.]+)(,)`,
    );
    next = replaceAnchor(next, pattern, `$1${formatRate(rates[code])}$3`);
  }

  return next;
}

function replaceAnchor(source: string, pattern: RegExp, replacement: string): string {
  if (!pattern.test(source)) {
    throw new Error(
      `remittance-config.ts structure drifted — anchor not found: ${pattern.source}`,
    );
  }
  return source.replace(pattern, replacement);
}

/**
 * Sanity gate: a fresh rate more than 10× away from the stored one means the
 * feed is wrong (base mix-up, unit error), not the market. Returns the list
 * of offending codes; empty means plausible.
 */
export function implausibleMoves(
  previous: Record<string, number>,
  fresh: Record<string, number>,
): string[] {
  return Object.keys(fresh).filter((code) => {
    const prev = previous[code];
    if (!prev) return false;
    return fresh[code] > prev * 10 || fresh[code] < prev / 10;
  });
}

/** Extract the currently-stored rates from the config source. */
export function extractStoredRates(source: string): Record<string, number> {
  const rates: Record<string, number> = {};
  for (const code of EXPECTED_CURRENCIES) {
    const match = source.match(new RegExp(`\\{ code: "${code}"[^}]*?rate: ([0-9.]+),`));
    if (!match) throw new Error(`No stored rate found for ${code}`);
    rates[code] = Number(match[1]);
  }
  return rates;
}

async function main(): Promise<void> {
  console.log(`Fetching ECB reference rates: ${RATES_URL}`);
  const res = await fetch(RATES_URL, {
    headers: { "user-agent": "FinTechAtlas/1.0 (fx snapshot refresher)" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    throw new Error(`Frankfurter fetch failed: HTTP ${res.status}`);
  }
  const { date, rates } = parseRatesResponse(await res.text());

  const source = readFileSync(CONFIG_PATH, "utf8");
  const previous = extractStoredRates(source);
  const bad = implausibleMoves(previous, rates);
  if (bad.length > 0) {
    throw new Error(
      `Implausible move(s) vs stored snapshot for: ${bad.join(", ")} — refusing to write`,
    );
  }

  writeFileSync(CONFIG_PATH, applyRatesToConfig(source, date, rates));
  console.log(`Snapshot updated to ${date}:`);
  for (const code of EXPECTED_CURRENCIES) {
    console.log(`  USD/${code} ${previous[code]} → ${formatRate(rates[code])}`);
  }
  console.log(`Written: ${CONFIG_PATH}`);
}

const isMain =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}
