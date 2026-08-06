import type { Metadata } from "next";
import { GlossaryClient } from "./client";
import { canonicalUrl } from "@/lib/canonical-url";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Plain-language definitions of every FinTech term used on this site — from ACH and interchange to DeFi and stablecoins.";

export const metadata: Metadata = {
  title: "FinTech Glossary & Terminology",
  description,
  alternates: { canonical: canonicalUrl("/glossary") },
  openGraph: {
    ...openGraphImage,
    title: "FinTech Glossary & Terminology — FinTech Atlas",
    description,
    url: canonicalUrl("/glossary"),
  },
};

export default function GlossaryPage() {
  return <GlossaryClient />;
}