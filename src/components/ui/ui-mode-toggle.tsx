"use client";

import { useUiMode } from "@/lib/ui-mode-context";

/**
 * Switches the entire site between the default "standard" treatment and the
 * from-scratch "boring" treatment. Lives next to the theme toggle in the
 * header so the two orthogonal axes (colour scheme vs visual density) are
 * clearly separated.
 */
export function UiModeToggle({ className = "" }: { className?: string }) {
  const { uiMode, toggleUiMode } = useUiMode();
  const isBoring = uiMode === "boring";

  return (
    <button
      type="button"
      onClick={toggleUiMode}
      aria-pressed={isBoring}
      title={isBoring ? "Boring view is on — switch to the standard view" : "Switch to the boring view"}
      aria-label={isBoring ? "Switch to standard view" : "Switch to boring view"}
      className={`btn-icon ${className}`}
    >
      {/* Icon only. A visible "Standard"/"Boring" label cannot fit the fixed
          36px `.btn-icon` box: its content measured 58px and, because the box
          does not clip, it painted over the adjacent theme toggle and
          intercepted its clicks — which is what failed the e2e theme-toggle
          flow on CI at 1280px (where the `xl:` label used to appear). State is
          carried by the icon, `aria-pressed`, and the label/title text. */}
      {isBoring ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      )}
    </button>
  );
}
