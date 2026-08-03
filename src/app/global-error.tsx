"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Global error boundary — the *only* error boundary that can catch a crash in
 * the root `layout.tsx` itself (a thrown Provider, a failed import, the
 * THEME_INIT_SCRIPT erroring, etc).
 *
 * `error.tsx` (the sibling error boundary at `app/error.tsx`) does NOT catch
 * root-layout failures, because `error.tsx` is itself rendered *inside* the
 * root layout — it can only catch errors from its siblings and descendants,
 * never its parent. When the root layout throws, Next.js *replaces* it
 * entirely with this file, which is why `global-error.tsx` must declare its
 * own <html>/<body> and is not allowed to export `metadata` (use the React
 * <title> element instead). See: Next.js 16 error.md / error-handling guide.
 *
 * Because the root layout's THEME_INIT_SCRIPT is gone when this file takes
 * over, we re-apply the saved theme inline before paint so dark-mode users
 * don't see a flash of unstyled light content on an already-bad experience.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Surface the error to the console / future error-reporting hook.
    console.error("Global error caught by global-error.tsx:", error);
  }, [error]);

  // Re-apply the theme before paint. We can't rely on the root layout's
  // init script (that layout is the thing that crashed), so do it inline.
  const THEME_INIT = `(() => {
    try {
      const stored = localStorage.getItem("theme");
      const theme = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
      const resolved = theme === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme;
      document.documentElement.setAttribute("data-theme", resolved);
    } catch {}
  })();`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Site Error — FinTech Atlas</title>
        {/* Minimal inline theme application — globals.css may still load via
            the original HTML shell, but we pin the attribute defensively. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        <style
          dangerouslySetInnerHTML={{
            // Inline the bare minimum styling so the page is visible even if
            // globals.css / the font providers never hydrate (which is the
            // failure mode this boundary exists for). Tokens mirror globals.css.
            __html: `
              :root[data-theme="light"] {
                --background: #fafafa; --foreground: #17171b;
                --muted: #71717a; --border: #e4e4e7;
                --accent: #6366f1; --danger: #b91c1c;
              }
              :root[data-theme="dark"], :root {
                --background: #08080a; --foreground: #e8e8ed;
                --muted: #a1a1aa; --border: #27272a;
                --accent: #818cf8; --danger: #f87171;
              }
              body {
                margin: 0; min-height: 100vh;
                background: var(--background); color: var(--foreground);
                font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
                display: flex; align-items: center; justify-content: center;
                padding: 2rem;
              }
              .ge-wrap { max-width: 36rem; text-align: center; }
              .ge-kicker { color: var(--muted); font-family: ui-monospace, monospace; font-size: 0.875rem; margin-bottom: 1rem; }
              .ge-title { font-size: 3rem; font-weight: 700; letter-spacing: -0.025em; margin: 0 0 1rem; }
              .ge-body { color: var(--muted); line-height: 1.6; margin: 0 0 1.5rem; }
              .ge-digest { color: var(--muted); font-family: ui-monospace, monospace; font-size: 0.75rem; margin: 0 0 2rem; }
              .ge-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
              .ge-btn {
                display: inline-flex; align-items: center; gap: 0.5rem;
                padding: 0.75rem 1.25rem; border-radius: 0.75rem;
                font-size: 0.875rem; font-weight: 600; border: 1px solid var(--border);
                background: var(--accent); color: #fff; cursor: pointer; text-decoration: none;
                transition: opacity 0.15s;
              }
              .ge-btn:hover { opacity: 0.9; }
              .ge-btn:focus-visible {
                outline: none;
                box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--accent);
              }
              .ge-btn--ghost { background: transparent; color: var(--foreground); }
            `,
          }}
        />
      </head>
      <body>
        <div className="ge-wrap">
          <p className="ge-kicker">$ atlas — error: site failed to render</p>
          <h1 className="ge-title">Something broke</h1>
          <p className="ge-body">
            We hit an unexpected error while loading the site. You can try
            reloading, or head back to a known-good page.
          </p>
          {error.digest && (
            <p className="ge-digest">error digest: {error.digest}</p>
          )}
          <div className="ge-actions">
            {/* unstable_retry re-fetches and re-renders the failed segment —
                the documented-recommended recovery action in Next.js 16. */}
            <button onClick={() => unstable_retry()} className="ge-btn">
              Try again
            </button>
            <Link href="/" className="ge-btn ge-btn--ghost">
              ← Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
