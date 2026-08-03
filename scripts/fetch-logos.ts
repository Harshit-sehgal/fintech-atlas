/**
 * scripts/fetch-logos.ts
 *
 * Downloads each company's OFFICIAL brand logo (via simple-icons' CDN,
 * cdn.simpleicons.org/<slug>) into public/logos/<fintechSlug>.svg so that
 * next/Image (or a plain <img>) can render the real brand mark instead of a
 * hand-drawn approximation.
 *
 * Run with:  npm run logos:fetch
 *
 * Brands not in simple-icons (manifest entry `si: null`) are skipped — the
 * inline fallback in CompanyLogo handles those. This script only ever
 * downloads real marks for the brands we verified are available.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { REAL_LOGO_SLUGS, LOGO_MANIFEST } from "./logos-manifest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = join(__dirname, "..", "public", "logos");
const SRC_DATA_DIR = join(__dirname, "..", "src", "data");
const CDN = "https://cdn.simpleicons.org";

/** Hard cap on a single downloaded SVG so a bad response can't bloat the repo. */
const MAX_SVG_BYTES = 64 * 1024; // 64 KB
/** Per-request timeout so a hung CDN doesn't stall the whole run. */
const FETCH_TIMEOUT_MS = 10_000;
/** Manifest of sha256 checksums for the sanitized SVG we last wrote. */
const CHECKSUM_MANIFEST = join(LOGOS_DIR, "checksums.json");

/** slug -> sha256 of the last written sanitized SVG (loaded from manifest). */
const checksums: Record<string, string> = {};

function loadChecksums(): void {
  if (!existsSync(CHECKSUM_MANIFEST)) return;
  try {
    Object.assign(checksums, JSON.parse(readFileSync(CHECKSUM_MANIFEST, "utf8")));
  } catch {
    // A corrupt manifest is non-fatal; we simply rebuild it this run.
  }
}

function saveChecksums(): void {
  writeFileSync(CHECKSUM_MANIFEST, `${JSON.stringify(checksums, null, 2)}\n`);
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * Removes executable / external content from a downloaded SVG so we never ship
 * a mark that could run scripts or reference external resources:
 *  - strips any <script>...</script> blocks,
 *  - strips event-handler attributes (onclick, onload, …),
 *  - strips javascript: hrefs and external http(s) hrefs/xlink:hrefs while
 *    preserving internal fragment references (e.g. url(#gradient)).
 */
function sanitizeSvg(svg: string): string {
  let out = svg.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  out = out.replace(
    /\s(?:xlink:)?href\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi,
    ' href=""',
  );
  out = out.replace(
    /\s(?:xlink:)?href\s*=\s*("[^#"][^"]*"|'[^#'][^']*')/gi,
    ' href=""',
  );
  return out;
}

/** Relative luminance of a #rrggbb / #rgb color (0–1). */
function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (full.length !== 6) return 0.5;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Pulls the (first) fill color out of a downloaded simple-icons SVG. */
function svgFill(svg: string): string | null {
  const m = svg.match(/fill="(#[0-9a-fA-F]{3,8})"/);
  return m ? m[1] : null;
}

/**
 * Decides the tile treatment for a downloaded logo so the mark is always
 * legible on the dark UI:
 *  - `bg` set in the manifest → use that exact branded surface (Apple Pay =>
 *    black tile, Wise => green tile, Klarna => pink tile, Brex => orange).
 *  - else, if the mark's fill is DARK (luminance < ~0.3) it would vanish on the
 *    dark neutral tile — so wrap it in a white inset mini-tile (`light`).
 *  - else the bright/light fill shows fine directly on the dark neutral tile
 *    (`dark` — transparent inset, mark floats on the brand-appropriate dark
 *    surface that CompanyLogo renders by default for real logos).
 */
function tileFor(slug: string): { bg?: string; tile?: "light" | "dark" } {
  const entry = LOGO_MANIFEST[slug];
  if (entry?.bg) return { bg: entry.bg };
  try {
    const svg = readFileSync(join(LOGOS_DIR, `${slug}.svg`), "utf8");
    const fill = svgFill(svg);
    if (fill && luminance(fill) < 0.3) return { tile: "light" };
  } catch {
    /* treat as unknown */
  }
  return { tile: "dark" };
}

/**
 * Writes a TypeScript module `src/data/logos-index.ts` containing the set of
 * slugs that have a real downloaded SVG in public/logos/, plus per-slug tile
 * treatment so the (sometimes dark) brand mark is always legible on the dark
 * UI. Generated so CompanyLogo can decide, at render time, between the real
 * /logos/<slug>.svg and the inline-SVG fallback — without bundling the full
 * ~150-entry manifest into every client component.
 */
function writeAvailableLogosIndex(downloaded: Set<string>) {
  const entries = Array.from(downloaded)
    .sort()
    .map((fintech) => {
      const t = tileFor(fintech);
      const obj: Record<string, string> = {};
      if (t.bg) obj.bg = t.bg;
      if (t.tile) obj.tile = t.tile;
      const body = Object.entries(obj)
        .map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`)
        .join(", ");
      return `  ${JSON.stringify(fintech)}: { ${body} }`;
    });
  const ts = `// AUTO-GENERATED by scripts/fetch-logos.ts — do not edit by hand.
// Slugs that have a real official brand SVG at public/logos/<slug>.svg.
//   bg     : brand-correct surface (Apple Pay black, Wise green, Klarna pink…)
//   tile   : "light" => white inset mini-tile for dark-fill marks;
//            "dark"  => mark sits directly on the dark neutral surface.
// Used by <CompanyLogo> to keep every official logo legible on the dark UI.
export const REAL_LOGOS: Record<string, { bg?: string; tile?: "light" | "dark" }> = {
${entries.join(",\n")},
};
`;
  writeFileSync(join(SRC_DATA_DIR, "logos-index.ts"), ts);
}

async function fetchOne(
  fintech: string,
  si: string,
): Promise<{ fintech: string; ok: boolean; bytes: number; reason?: string; changed?: boolean }> {
  const url = `${CDN}/${si}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { redirect: "follow", signal: controller.signal });
    if (!res.ok) return { fintech, ok: false, bytes: 0, reason: `HTTP ${res.status}` };
    const raw = await res.text();
    if (!raw.trim().startsWith("<svg")) return { fintech, ok: false, bytes: 0, reason: "not an SVG" };
    if (Buffer.byteLength(raw) > MAX_SVG_BYTES) {
      return { fintech, ok: false, bytes: 0, reason: `exceeds ${MAX_SVG_BYTES / 1024}KB cap` };
    }
    const svg = sanitizeSvg(raw);
    const hash = sha256(svg);
    // Fail when an icon we've already pinned changes (upstream moved/blinked),
    // so the change is reviewed instead of silently landing.
    const previous = checksums[fintech];
    const changed = Boolean(previous && previous !== hash);
    writeFileSync(join(LOGOS_DIR, `${fintech}.svg`), svg);
    checksums[fintech] = hash;
    return { fintech, ok: true, bytes: Buffer.byteLength(svg), changed };
  } catch (err) {
    return { fintech, ok: false, bytes: 0, reason: String(err) };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  if (!existsSync(LOGOS_DIR)) mkdirSync(LOGOS_DIR, { recursive: true });
  loadChecksums();

  console.log(`\nFetching ${REAL_LOGO_SLUGS.length} official brand logos → public/logos/\n`);

  // Run in bounded concurrency to be polite to the CDN.
  const results: Awaited<ReturnType<typeof fetchOne>>[] = [];
  const concurrency = 6;
  let cursor = 0;
  async function worker() {
    while (cursor < REAL_LOGO_SLUGS.length) {
      const i = cursor++;
      const { fintech, si } = REAL_LOGO_SLUGS[i];
      const r = await fetchOne(fintech, si);
      results.push(r);
      const flag = r.changed ? "⚠  SHA CHANGE" : r.ok ? `(${r.bytes}b)` : (r.reason ?? "");
      console.log(`  ${r.ok ? "✓" : "✗"} ${fintech.padEnd(20)} ${flag}`);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const ok = results.filter((r) => r.ok);
  const bad = results.filter((r) => !r.ok);
  const changed = results.filter((r) => r.changed);
  writeAvailableLogosIndex(new Set(ok.map((r) => r.fintech)));
  saveChecksums();
  console.log(`\nDone. ${ok.length}/${results.length} logos downloaded to public/logos/.`);
  console.log(`Wrote src/data/logos-index.ts (index of ${ok.length} real-logo brand tiles).`);
  console.log(`Wrote checksum manifest: ${CHECKSUM_MANIFEST}`);
  if (bad.length) {
    console.log(`Skipped/failed (${bad.length}): ${bad.map((b) => b.fintech).join(", ")} (will use inline fallback)`);
  }
  if (changed.length) {
    // Fail loudly so a silently-changed upstream icon is reviewed rather than
    // landing in the repo unnoticed.
    console.error(
      `\n[error] Icon checksums changed for: ${changed.map((c) => c.fintech).join(", ")}.\n` +
        `Upstream marks moved or changed. Review the diff, then re-run logos:fetch to pin the new checksums.`,
    );
    process.exit(1);
  }
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
