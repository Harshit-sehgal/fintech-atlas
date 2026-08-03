import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site-config";
import { openGraphImage } from "@/lib/shared-metadata";

const description = "This page doesn't exist or has moved to a different route.";

export const metadata: Metadata = {
  title: "Page Not Found",
  description,
  alternates: { canonical: "/404" },
  openGraph: {
    ...openGraphImage,
    title: "Page Not Found — FinTech Atlas",
    description,
    url: `${SITE_URL}/404`,
  },
};

export default function NotFound() {
  return (
    <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-32 text-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.04] blur-[100px]" />
      </div>
      <p className="mono-accent mb-4">$ cat: 404 — not found</p>
      <h1 className="text-7xl font-bold tracking-tight gradient-text">404</h1>
      <p className="mt-4 text-base text-[var(--muted-text)]">
        This page doesn&apos;t exist or has moved to a different route.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition-all hover:opacity-90 hover:scale-105"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
