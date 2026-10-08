/**
 * Grouping for large "research directory" datasets (T156).
 *
 * The global and India research directories are the same shape: a flat list
 * of records, each tagged with a cluster index, plus an ordered array of
 * cluster names of the form "REGION — COUNTRY" (or "GLOBAL — THEME"). This
 * module turns that into the region → cluster → records tree the UI renders as
 * a collapsible atlas, so any future directory (another country, another
 * vertical, a partner list) gets the same scannable structure for free.
 *
 * Kept pure and generic (a `clusterIndex` selector) so it is unit-testable and
 * reusable without pulling in React or the generated data.
 */

export interface DirectoryCluster<T> {
  /** Index into the source cluster-name array (stable across builds). */
  index: number;
  region: string;
  label: string;
  items: T[];
}

export interface DirectoryRegion<T> {
  name: string;
  clusters: DirectoryCluster<T>[];
  total: number;
}

/** Split "NORTH AMERICA — United States" into region and country label. */
export function splitClusterName(name: string): { region: string; label: string } {
  const sep = name.indexOf(" — ");
  return sep >= 0
    ? { region: name.slice(0, sep), label: name.slice(sep + 3) }
    : { region: "GLOBAL", label: name };
}

/**
 * Build the region → cluster tree. Region order follows first appearance in
 * `clusterNames` (which the generator already emits region-grouped), and empty
 * clusters are dropped so a renamed/absent cluster never renders a dead row.
 */
export function groupDirectory<T>(
  clusterNames: readonly string[],
  rows: readonly T[],
  clusterIndex: (row: T) => number,
): DirectoryRegion<T>[] {
  const buckets: T[][] = clusterNames.map(() => []);
  for (const row of rows) {
    const index = clusterIndex(row);
    if (buckets[index]) buckets[index].push(row);
  }

  const order: string[] = [];
  const byName = new Map<string, DirectoryRegion<T>>();
  clusterNames.forEach((name, index) => {
    if (buckets[index].length === 0) return;
    const { region, label } = splitClusterName(name);
    if (!byName.has(region)) {
      byName.set(region, { name: region, clusters: [], total: 0 });
      order.push(region);
    }
    const group = byName.get(region)!;
    group.clusters.push({ index, region, label, items: buckets[index] });
    group.total += buckets[index].length;
  });
  return order.map((name) => byName.get(name)!);
}
