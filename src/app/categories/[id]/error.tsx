"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Per-segment error boundary for /categories/[id]. Catches errors thrown while
 * rendering a single category page so one broken category doesn't crash the
 * whole route tree.
 */
export default function CategoryError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  // Log in an effect, not during render — matches app/error.tsx and keeps the
  // render pure (React may re-render error boundaries during recovery).
  useEffect(() => {
    console.error("Category page error:", error);
  }, [error]);
  return (
    <div className="relative mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
      <p className="mb-3 text-sm font-mono text-[var(--muted-text)]">
        $ atlas open --category: failed
      </p>
      <h1 className="text-4xl font-bold tracking-tight gradient-text">
        Category failed to load
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--muted-text)]">
        Something went wrong while rendering this category page. Try again, or
        browse all categories.
      </p>
      {error.digest && (
        <p className="mt-4 font-mono text-[11px] text-[var(--muted-dim)]">
          error digest: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
        <button onClick={() => unstable_retry()} className="btn-primary">
          Try again
        </button>
        <Link href="/categories" className="btn-ghost">
          ← All categories
        </Link>
      </div>
    </div>
  );
}
