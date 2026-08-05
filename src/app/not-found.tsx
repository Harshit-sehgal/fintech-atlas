import type { Metadata } from "next";
import Link from "next/link";
const description = "This page doesn't exist or has moved to a different route.";

export const metadata: Metadata = {
  title: "Page Not Found",
  description,
  // Error pages should not advertise a canonical share URL.
  openGraph: undefined,
  // robots is intentionally omitted — the root layout emits a permissive
  // <meta name="robots">, and we add a <meta name="robots" content="noindex, nofollow">
  // at the top of the component body to override it. Putting `robots` in the
  // metadata export would deep-merge with the root layout's and produce
  // duplicate <meta> tags with conflicting directives.
};

export default function NotFound() {
  return (
    <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-32 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
        Page not found
      </p>
      <h1 className="text-7xl font-bold tracking-tight gradient-text">404</h1>
      <h2 className="sr-only">Page not found</h2>
      <p className="mt-4 text-base text-[var(--muted-text)]">
        This page doesn&apos;t exist or has moved to a different route.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition-all hover:opacity-90"
      >
        ← Back to Home
      </Link>
    </div>
  );
}