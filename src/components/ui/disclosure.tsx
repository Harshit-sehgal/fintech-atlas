"use client";

import type { ReactNode } from "react";

/**
 * Headless single-level disclosure (T156): a summary button that toggles a
 * content region, with correct `aria-expanded`. Extracted from the directory
 * atlas so every large, groupable list (regions, countries, categories, saved
 * searches) can collapse the same way instead of re-implementing the pattern.
 *
 * Controlled on purpose — the parent owns which groups are open, so it can
 * force-expand everything while a search is active.
 */
export function Disclosure({
  open,
  onToggle,
  summary,
  children,
  className = "",
  summaryClassName = "",
}: {
  open: boolean;
  onToggle: () => void;
  summary: (expanded: boolean) => ReactNode;
  children: ReactNode;
  className?: string;
  summaryClassName?: string;
}) {
  return (
    <div className={className}>
      <button type="button" aria-expanded={open} onClick={onToggle} className={summaryClassName}>
        {summary(open)}
      </button>
      {open ? <div>{children}</div> : null}
    </div>
  );
}
