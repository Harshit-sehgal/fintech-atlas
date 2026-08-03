/**
 * Lightweight fuzzy string matching for client-side search.
 * Scores how well `query` matches `text` (higher is better; 0 = no match).
 *
 * Matching rules:
 * - Exact substring match scores highest
 * - Consecutive character subsequence (typo-tolerant) scores lower
 * - Leading-word bonus when the query matches the start of a word
 */

export function fuzzyScore(text: string, query: string): number {
  const hay = text.toLowerCase();
  const needle = query.toLowerCase().trim();
  if (!needle) return 1;
  if (!hay) return 0;

  const idx = hay.indexOf(needle);
  if (idx >= 0) {
    let score = 100 - Math.min(idx, 40);
    if (idx === 0 || /[\s\-_/]/.test(hay[idx - 1] ?? "")) score += 20;
    return score;
  }

  // Subsequence match (allows skipped characters — covers simple typos/omissions).
  let hi = 0;
  let consecutive = 0;
  let maxConsecutive = 0;
  let matched = 0;
  for (let ni = 0; ni < needle.length; ni++) {
    const ch = needle[ni];
    let found = false;
    while (hi < hay.length) {
      if (hay[hi] === ch) {
        matched++;
        consecutive++;
        maxConsecutive = Math.max(maxConsecutive, consecutive);
        hi++;
        found = true;
        break;
      }
      consecutive = 0;
      hi++;
    }
    if (!found) return 0;
  }

  const coverage = matched / needle.length;
  return Math.round(30 * coverage + 10 * (maxConsecutive / needle.length));
}

/** True when query fuzzily matches any of the candidate strings. */
export function fuzzyMatchAny(candidates: string[], query: string, minScore = 25): boolean {
  const q = query.trim();
  if (!q) return true;
  return candidates.some((c) => fuzzyScore(c, q) >= minScore);
}

/** Sort items by best fuzzy score against a list of fields (descending). */
export function fuzzyRank<T>(
  items: T[],
  query: string,
  fields: (item: T) => string[],
  minScore = 25,
): T[] {
  const q = query.trim();
  if (!q) return items;

  const seen = new Set<T>();
  return items
    .map((item, index) => ({
      item,
      index,
      score: Math.max(...fields(item).map((f) => fuzzyScore(f, q))),
    }))
    .filter((row) => row.score >= minScore)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .filter((row) => {
      if (seen.has(row.item)) return false;
      seen.add(row.item);
      return true;
    })
    .map((row) => row.item);
}
