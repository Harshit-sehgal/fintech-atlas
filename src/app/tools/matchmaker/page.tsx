import type { Metadata } from "next";
import { Suspense } from "react";
import MatchmakerQuizPageClient from "./matchmaker-client";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description =
  "Answer 4 quick questions about your business or personal finance needs to get a tailored recommendation of top FinTech platforms.";

export const metadata: Metadata = {
  title: "FinTech Matchmaker Quiz",
  description,
  alternates: { canonical: "/tools/matchmaker" },
  openGraph: {
    ...openGraphImage,
    title: "FinTech Matchmaker Quiz — FinTech Atlas",
    description,
    url: `${SITE_URL}/tools/matchmaker`,
  },
};

export default function MatchmakerQuizPage() {
  return (
    <Suspense fallback={<div className="px-5 py-24 text-center text-sm text-[var(--muted-text)]">Loading quiz…</div>}>
      <MatchmakerQuizPageClient />
    </Suspense>
  );
}
