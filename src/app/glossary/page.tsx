import type { Metadata } from "next";
import { Suspense } from "react";
import { GlossaryClient } from "./client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Plain-language definitions of every FinTech term used on this site — from ACH and interchange to DeFi and stablecoins.";

export const metadata: Metadata = {
  title: "FinTech Glossary & Terminology",
  description,
  alternates: { canonical: "/glossary" },
  openGraph: {
    ...openGraphImage,
    title: "FinTech Glossary & Terminology — FinTech Atlas",
    description,
    url: `${SITE_URL}/glossary`,
  },
};

export default function GlossaryPage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading glossary…</div>}>
      <GlossaryClient />
    </Suspense>
  );
}