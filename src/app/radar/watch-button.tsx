"use client";

import { useCallback, useEffect, useState } from "react";
import { isWatched, toggleWatch, WATCHLIST_EVENT } from "@/lib/watchlists";

export function WatchButton({ slug, label }: { slug: string; label: string }) {
  const [watched, setWatched] = useState(() =>
    typeof window === "undefined" ? false : isWatched(slug),
  );

  useEffect(() => {
    const refresh = () => setWatched(isWatched(slug));
    window.addEventListener(WATCHLIST_EVENT, refresh);
    return () => window.removeEventListener(WATCHLIST_EVENT, refresh);
  }, [slug]);

  const handleToggle = useCallback(() => {
    setWatched(toggleWatch(slug).includes(slug));
  }, [slug]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      data-placement="radar-watch"
      data-watched={watched ? "true" : "false"}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] px-3.5 py-2 text-sm font-medium transition-colors hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
    >
      <span aria-hidden>{watched ? "●" : "○"}</span>
      {watched ? "On watchlist" : "Watch"}
      <span className="sr-only">{label}</span>
    </button>
  );
}