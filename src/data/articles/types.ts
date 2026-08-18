
/**
 * SEO article catalog (Phase 2 of the monetization plan).
 *
 * Data-driven long-tail editorial content — money-adjacent comparisons that
 * rank for commercial-intent searches and route readers to company profiles,
 * tools, and (once enrolled) affiliate CTAs. Each article is fully static
 * (SSG) and lives at `/articles/<slug>`.
 *
 * FEES ARE ILLUSTRATIVE: they reflect published standard rates as of the
 * catalog vintage and are NOT live quotes. Always verify with the provider.
 */

import type { PartnerCtaPlacement } from "@/lib/partners";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface ArticleCta {
  slug: string;
  label: string;
  placement: PartnerCtaPlacement;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  /** Named author (T015: required for Google trust signals on financial content). */
  author: string;
  /** ISO date YYYY-MM-DD. */
  publishedAt: string;
  updatedAt: string;
  category: string;
  /** Company profile slugs linked from the article (internal linking layer). */
  relatedCompanySlugs: string[];
  /** Regional focus (drives the India surface and sitemap regions). */
  regions: string[];

  /** Commercial CTAs placed in the article's call-to-action band. */
  ctas: ArticleCta[];
  /** Related interactive tool (plan T049: every article links its calculator). */
  relatedTool?: { href: string; label: string };
  /** Curated cross-article links (plan T052: related guides on genuine relevance). */
  relatedArticleSlugs?: string[];
  body: ArticleBlock[];
}


export interface ArticleCategory {
  slug: string;
  name: string;
  description: string;
}

export const articleCategories: ArticleCategory[] = [
  {
    slug: "cross-border",
    name: "Cross-Border",
    description:
      "International money movement: receiving USD abroad, FX fees, remittance rails, and settlement times.",
  },
  {
    slug: "payments",
    name: "Payments",
    description:
      "Payment gateways and processing: fee structures, platform comparisons, and gateway selection.",
  },
  {
    slug: "business-banking",
    name: "Business Banking",
    description:
      "Business banking and treasury accounts: business bank accounts and corporate cash management.",
  },
  {
    slug: "neobanks",
    name: "Neobanks",
    description:
      "Digital-first banks and app-based banking services without physical branches.",
  },
  {
    slug: "investing",
    name: "Investing",
    description:
      "Investing and trading platforms: brokerages, crypto exchanges, and investment products.",
  },
  {
    slug: "payroll",
    name: "Payroll",
    description:
      "Payroll and HR administration: running compliant payroll across team structures.",
  },
  {
    slug: "bnpl",
    name: "BNPL",
    description:
      "Buy-now-pay-later and point-of-sale credit: instalment lending at checkout.",
  },
];

const ARTICLE_CATEGORY_BY_NAME = new Map(articleCategories.map((c) => [c.name, c]));

export function getArticleCategory(name: string): ArticleCategory | undefined {
  return ARTICLE_CATEGORY_BY_NAME.get(name);
}

export function categoryHref(name: string): string {
  const cat = getArticleCategory(name);
  return cat ? `/articles/category/${cat.slug}` : "/articles";
}


