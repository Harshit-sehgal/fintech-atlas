"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function CompareError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Compare route error:", error);
  }, [error]);

  return (
    <div className="relative mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--danger-text)]">
        Compare error
      </p>
      <h1 className="text-4xl font-bold tracking-tight gradient-text">Comparison failed to load</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--muted-text)]">
        Something went wrong while rendering the comparison tool. Try again, or browse the directory.
      </p>
      {error.digest && (
        <p className="mt-4 font-mono text-[11px] text-[var(--muted-dim)]">
          error digest: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
        <button onClick={() => unstable_retry()} className="btn-primary" aria-label="Try loading compare again">
          Try again
        </button>
        <Link href="/companies" className="btn-ghost">
          ← Companies
        </Link>
      </div>
    </div>
  );
}
