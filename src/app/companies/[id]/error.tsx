"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Per-segment error boundary for /companies/[id]. Catches errors thrown while
 * rendering a single company profile (generateMetadata, the page body) so one
 * broken profile doesn't crash the whole route tree.
 */
export default function CompanyError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  // Log in an effect, not during render — matches app/error.tsx and keeps the
  // render pure (React may re-render error boundaries during recovery).
  useEffect(() => {
    console.error("Company profile error:", error);
  }, [error]);
  return (
    <div className="relative mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
      <p className="mb-3 text-sm font-mono text-[var(--muted-text)]">
        $ atlas open --profile: failed
      </p>
      <h1 className="text-4xl font-bold tracking-tight gradient-text">
        Profile failed to load
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--muted-text)]">
        Something went wrong while rendering this company profile. It may be a
        data issue or a render error — try again, or browse the directory.
      </p>
      {error.digest && (
        <p className="mt-4 font-mono text-[11px] text-[var(--muted-dim)]">
          error digest: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
        <button onClick={() => unstable_retry()} className="btn-primary" aria-label="Try loading this company profile again">
          Try again
        </button>
        <Link href="/companies" className="btn-ghost">
          ← All companies
        </Link>
      </div>
    </div>
  );
}
