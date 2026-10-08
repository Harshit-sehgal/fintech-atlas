"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Client-side redirect for retired routes in the static export.
 *
 * `output: export` cannot use next.config `redirects()`, so retired hubs
 * render a valid, breadcrumbed page that immediately replaces the URL and
 * offers a real link as a fallback. The page is marked noindex and excluded
 * from the sitemap so search engines keep the canonical destination.
 */
export function Redirect({ to, label }: { to: string; label: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <p className="text-sm text-[var(--muted-text)]">
      Moved to{" "}
      <Link className="hl-link font-semibold text-[var(--accent)]" href={to}>
        {label}
      </Link>
      . If you are not redirected automatically, follow the link.
    </p>
  );
}
