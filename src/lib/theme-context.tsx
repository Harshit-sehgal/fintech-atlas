"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, useCallback, ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (t: Theme | ((prev: Theme) => Theme)) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
const THEME_KEY = "theme";
const THEME_EVENT = "fintech-atlas-theme-change";

function readTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
  } catch {
    return "system";
  }
}

function subscribeTheme(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === THEME_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_EVENT, onStoreChange);
  };
}

function readSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeSystemTheme(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribeTheme, readTheme, () => "system" as Theme);
  const systemTheme = useSyncExternalStore<ResolvedTheme>(subscribeSystemTheme, readSystemTheme, () => "light" as ResolvedTheme);
  const resolvedTheme: ResolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme | ((prev: Theme) => Theme)) => {
    const current = readTheme();
    const value = typeof next === "function" ? next(current) : next;
    try {
      localStorage.setItem(THEME_KEY, value);
      window.dispatchEvent(new Event(THEME_EVENT));
    } catch {
      // Theme preference is best-effort when storage is unavailable.
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}