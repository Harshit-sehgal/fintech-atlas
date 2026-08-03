import fs from "node:fs";
import path from "node:path";

const configPath = path.resolve(process.cwd(), "src/data/remittance-config.ts");
const source = fs.readFileSync(configPath, "utf8");
const asOfMatch = source.match(/RATES_AS_OF\s*=\s*["']([^"']+)["']/);
const maxAgeMatch = source.match(/MAX_RATE_AGE_DAYS\s*=\s*(\d+)/);

if (!asOfMatch || !maxAgeMatch) {
  throw new Error("Remittance snapshot is missing RATES_AS_OF or MAX_RATE_AGE_DAYS.");
}

const asOf = Date.parse(asOfMatch[1]);
const maxAgeDays = Number(maxAgeMatch[1]);
const ageDays = (Date.now() - asOf) / (24 * 60 * 60 * 1000);

if (!Number.isFinite(asOf) || !Number.isFinite(maxAgeDays) || ageDays > maxAgeDays) {
  throw new Error(
    `Remittance rate snapshot is stale or invalid: asOf=${asOfMatch[1]}, maxAgeDays=${maxAgeMatch[1]}. Refresh src/data/remittance-config.ts before building.`,
  );
}

console.log(`Remittance snapshot is fresh: ${asOfMatch[1]} (${ageDays.toFixed(1)} days old).`);
