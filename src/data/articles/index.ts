// GENERATED SPLIT — do not hand-edit; see src/data/articles/index.ts (barrel).

export * from "./types";
import type { Article } from "./types";
import { part_1_Articles } from "./part_1";
import { part_2_Articles } from "./part_2";
import { part_3_Articles } from "./part_3";

export const articles: Article[] = [
  ...part_1_Articles,
  ...part_2_Articles,
  ...part_3_Articles,
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
