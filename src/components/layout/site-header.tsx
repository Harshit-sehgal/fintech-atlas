"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookmarks } from "@/lib/bookmarks-context";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { animationPresets as animation } from "@/lib/animation";

// Lazy-load the command palette so its heavy data import (the full companies /
// categories / glossary catalogue) is NOT shipped on every page's initial
// bundle — it's fetched only when the user opens search (⌘K / Ctrl+K).
const CommandPalette = dynamic(
  () => import("@/components/ui/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);

const nav = [
  { href: "/", label: "Home" },
  { href: "/companies", label: "Companies" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/glossary", label: "Glossary" },
  { href: "/bookmarks", label: "Saved" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const { bookmarks, glossaryBookmarks } = useBookmarks();
  const [scrolled, setScrolled] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Global Ctrl+K shortcut — opens (or toggles) the command palette
  // regardless of which element currently has focus.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Platform-aware shortcut label (macOS uses ⌘K, elsewhere Ctrl+K). Must be set
  // after mount: reading navigator during SSR would produce inconsistent HTML
  // (hydration mismatch), so a one-time post-mount update is the correct
  // pattern for this browser-only, imperative value.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(
      typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad/.test(navigator.platform ?? ""),
    );
  }, []);

  const totalSaved = bookmarks.length + glossaryBookmarks.length;

  return (
    <>
      <header
        className={`sticky top-0 z-40 glass border-b transition-colors duration-300 ${
          scrolled
            ? "border-[var(--border-color)] shadow-[0_1px_0_rgba(0,0,0,0.03)]"
            : "border-[var(--border-color)]"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)] transition-transform duration-300 group-hover:rotate-6">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 3.5h12M2 8h12M2 12.5h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-[15px] font-semibold tracking-tight">FinTech Atlas</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const isSavedNav = item.href === "/bookmarks";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-md px-2.5 py-1.5 text-sm transition-colors flex items-center gap-1.5 ${
                    active ? "text-[var(--foreground)] font-medium" : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                  {isSavedNav && totalSaved > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                      {totalSaved}
                    </span>
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2.5 -bottom-px h-px bg-[var(--foreground)]"
                      transition={animation.transition.springDefault}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Trigger & Mobile Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 surface rounded-lg px-3 py-1.5 text-xs text-[var(--muted-text)] transition-colors hover:text-[var(--foreground)] hover:border-[var(--border-strong)] focus-visible:text-[var(--foreground)] focus-visible:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
              aria-label="Search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden font-mono text-[10px] text-[var(--foreground)] sm:inline-block bg-[var(--border-color)] px-1.5 py-0.5 rounded">
                {isMac ? "⌘K" : "Ctrl K"}
              </kbd>
            </button>

            <ThemeToggle className="hidden lg:flex" />

            {/* Mobile menu toggle */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--foreground)] hover:bg-[var(--subtle-bg)] focus-visible:bg-[var(--subtle-bg)] focus-visible:outline-none focus-visible:ring-[var(--ring)] lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <motion.path
                  animate={open ? { d: "M4 4L14 14" } : { d: "M3 5h12" }}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <motion.path
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  d="M3 9h12"
                />
                <motion.path
                  animate={open ? { d: "M4 14L14 4" } : { d: "M3 13h12" }}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.nav
              aria-label="Mobile menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={animation.transition.layoutEaseInOut}
              className="overflow-hidden border-t border-[var(--border-color)] lg:hidden"
            >
              <div className="mx-auto flex max-w-6xl flex-col px-5 py-2">
                {nav.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  const isSavedNav = item.href === "/bookmarks";
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between py-2.5 text-sm ${
                        active ? "text-[var(--foreground)] font-semibold" : "text-[var(--muted-text)]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSavedNav && totalSaved > 0 && (
                        <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs text-white">
                          {totalSaved}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
}