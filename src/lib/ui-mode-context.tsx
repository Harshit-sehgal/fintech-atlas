"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, useCallback, ReactNode } from "react";

/**
 * UI mode: the site ships two distinct visual treatments.
 *
 *  - "standard" — the default editorial design (refined, high-contrast, calm).
 *  - "boring"   — a from-scratch, monochrome, minimal, fully-structured
 *                presentation. No brand colour, no motion, plain typography.
 *
 * The choice is persisted and mirrored onto <html data-ui-mode> so global CSS
 * (see globals.css `:root[data-ui-mode="boring"]`) can restyle every surface,
 * and so the preference survives a reload without a flash (an init script in
 * the document head applies it before paint).
 */

export type UiMode = "standard" | "boring";

interface UiModeContextProps {
  uiMode: UiMode;
  setUiMode: (m: UiMode | ((prev: UiMode) => UiMode)) => void;
  toggleUiMode: () => void;
}

const UiModeContext = createContext<UiModeContextProps | undefined>(undefined);
const UI_MODE_KEY = "ui-mode";
const UI_MODE_EVENT = "fintech-atlas-ui-mode-change";

function isUiMode(value: unknown): value is UiMode {
  return value === "standard" || value === "boring";
}

function readUiMode(): UiMode {
  if (typeof window === "undefined") return "standard";
  try {
    const stored = window.localStorage.getItem(UI_MODE_KEY);
    return isUiMode(stored) ? stored : "standard";
  } catch {
    return "standard";
  }
}

function subscribeUiMode(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === UI_MODE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(UI_MODE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(UI_MODE_EVENT, onStoreChange);
  };
}

export function UiModeProvider({ children }: { children: ReactNode }) {
  const uiMode = useSyncExternalStore<UiMode>(subscribeUiMode, readUiMode, () => "standard" as UiMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-ui-mode", uiMode);
  }, [uiMode]);

  const setUiMode = useCallback((next: UiMode | ((prev: UiMode) => UiMode)) => {
    const current = readUiMode();
    const value = typeof next === "function" ? next(current) : next;
    try {
      localStorage.setItem(UI_MODE_KEY, value);
      window.dispatchEvent(new Event(UI_MODE_EVENT));
    } catch {
      // UI-mode preference is best-effort when storage is unavailable.
    }
  }, []);

  const toggleUiMode = useCallback(() => {
    setUiMode((prev) => (prev === "boring" ? "standard" : "boring"));
  }, [setUiMode]);

  return (
    <UiModeContext.Provider value={{ uiMode, setUiMode, toggleUiMode }}>
      {children}
    </UiModeContext.Provider>
  );
}

export function useUiMode() {
  const ctx = useContext(UiModeContext);
  if (!ctx) throw new Error("useUiMode must be used within UiModeProvider");
  return ctx;
}
