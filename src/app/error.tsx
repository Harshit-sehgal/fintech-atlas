"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Root-segment error boundary — catches errors thrown during server-component
 * rendering (generateStaticParams, generateMetadata, page bodies) and gives
 * the user a styled recovery UI instead of Next.js's default error page.
 *
 * This is distinct from:
 *  - the <ErrorBoundary> React class boundary in layout.tsx (client-render
 *    errors only), and
 *  - app/global-error.tsx, which is the *only* boundary that can catch a
 *    crash in root layout.tsx itself (this file can't, because it is rendered
 *    inside the very layout it might need to replace).
 *
 * Prop: `unstable_retry` (Next.js 16 name for the former `reset`). It
 * re-fetches and re-renders the failed segment — the docs-recommended
 * recovery action. `reset` still exists but only re-renders from cache.
 */
export default function RootError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Surface the error to the console / future error-reporting hook.
    console.error("Route error caught by error.tsx:", error);
  }, [error]);

  return (
    <div className="relative mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--danger-text)]">
        Something went wrong
      </p>

      <h1 className="text-5xl font-bold tracking-tight gradient-text">
        Something broke
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--muted-text)]">
        We hit an unexpected error while rendering this page. You can try the
        page again, or head back to a known-good route.
      </p>

      {/* Error digest + message for transparency (digest is safe to expose) */}
      {error.digest && (
        <p className="mt-4 font-mono text-[11px] text-[var(--muted-dim)]">
          error digest: {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
        <button onClick={() => unstable_retry()} className="btn-primary" aria-label="Try loading this page again">
          Try again
        </button>
        <Link href="/" className="btn-ghost">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
