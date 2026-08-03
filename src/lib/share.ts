/**
 * Client-side share / export helpers for interactive tools.
 * Best-effort: never throw into the UI tree.
 */

export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }
  return false;
}

export async function shareOrCopy(opts: {
  title: string;
  text?: string;
  url: string;
}): Promise<"shared" | "copied" | "failed"> {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share({
        title: opts.title,
        text: opts.text,
        url: opts.url,
      });
      return "shared";
    }
  } catch (err) {
    // User cancel should not count as failure.
    if (err instanceof DOMException && err.name === "AbortError") return "failed";
  }

  const ok = await copyText(opts.url);
  return ok ? "copied" : "failed";
}

/** Download a UTF-8 CSV file in the browser. */
export function downloadCsv(filename: string, rows: string[][]): void {
  const escape = (cell: string) => {
    if (/[",\n\r]/.test(cell)) return `"${cell.replaceAll('"', '""')}"`;
    return cell;
  };
  const body = rows.map((row) => row.map((c) => escape(String(c))).join(",")).join("\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Encode a flat record of numbers/strings into a URLSearchParams-friendly object. */
export function encodeToolParams(
  prefix: string,
  values: Record<string, string | number | boolean | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) continue;
    params.set(`${prefix}${key}`, String(value));
  }
  return params;
}

/** Read prefixed numeric params from the current URL (client-only). */
export function readNumericParams(
  search: string,
  prefix: string,
  keys: string[],
): Partial<Record<string, number>> {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const out: Partial<Record<string, number>> = {};
  for (const key of keys) {
    const raw = params.get(`${prefix}${key}`);
    if (raw == null || raw === "") continue;
    const n = Number(raw);
    if (Number.isFinite(n)) out[key] = n;
  }
  return out;
}

const STORAGE_PREFIX = "fintech_atlas_tool_";

export function saveToolState(toolId: string, state: unknown): boolean {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${toolId}`, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadToolState<T>(toolId: string): T | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${toolId}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
