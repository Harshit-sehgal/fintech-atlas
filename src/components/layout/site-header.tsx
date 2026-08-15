"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
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

// Primary navigation — the five decision surfaces. Everything else lives in
// "More" so the bar stays calm and scannable (proven comparison-site pattern).
const primaryNav = [
  { href: "/india", label: "India" },
  { href: "/companies", label: "Companies" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/articles", label: "Guides" },
];

const moreNav = [
  { href: "/categories", label: "Categories" },
  { href: "/glossary", label: "Glossary" },
  { href: "/services", label: "Services" },
  { href: "/bookmarks", label: "Saved" },
  { href: "/about", label: "About" },
  { href: "/changelog", label: "Changelog" },
];

// App-like bottom navigation for touch screens (hidden on lg+ where the
// desktop bar shows everything). Kept to the five highest-value destinations
// so each target stays thumb-sized on a 360px viewport.
const bottomNav = [
  { href: "/", label: "Home" },
  { href: "/companies", label: "Companies" },
  { href: "/compare", label: "Compare" },
  { href: "/tools", label: "Tools" },
  { href: "/bookmarks", label: "Saved" },
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export function SiteHeader() {
  // Server-rendered pathname for the homepage is "/" but a static host can
  // surface the same document at "/index.html". Normalize so active-link
  // state (and its aria-current attribute) hydrates identically in both.
  const pathname = usePathname()?.replace(/\/index\.html$/, "") || "/";
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const { bookmarks, glossaryBookmarks } = useBookmarks();
  const [scrolled, setScrolled] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

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

  // Escape closes the "More" menu; click outside closes it.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
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
          <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-md px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5 ${
                    active ? "text-[var(--foreground)] font-medium" : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-px h-px bg-[var(--foreground)]"
                      transition={animation.transition.springDefault}
                    />
                  )}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  moreNav.some((item) => isActive(pathname, item.href))
                    ? "text-[var(--foreground)] font-medium"
                    : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
                }`}
              >
                More
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                >
                  <path d="M2.5 4.5L6 8l3.5-3.5" />
                </svg>
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    role="menu"
                    aria-label="More sections"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={animation.transition.reveal}
                    className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-[var(--border-color)] bg-[var(--card)] p-1.5 shadow-[var(--shadow-md)]"
                  >
                    {moreNav.map((item) => {
                      const active = isActive(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setMoreOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                            active
                              ? "bg-[var(--subtle-bg)] font-medium text-[var(--foreground)]"
                              : "text-[var(--muted-text)] hover:bg-[var(--subtle-bg)] hover:text-[var(--foreground)]"
                          }`}
                        >
                          <span>{item.label}</span>
                          {item.href === "/bookmarks" && totalSaved > 0 && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-white">
                              {totalSaved}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Search Trigger & Mobile Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--card)] py-1.5 pl-3 pr-1.5 text-xs text-[var(--muted-text)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)] focus-visible:text-[var(--foreground)] focus-visible:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-[var(--ring)]"
              aria-label="Search companies, tools and terms"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span className="hidden sm:inline">Search companies &amp; terms</span>
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
                {[...primaryNav, ...moreNav].map((item) => {
                  const active = isActive(pathname, item.href);
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
                      {item.href === "/bookmarks" && totalSaved > 0 && (
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

      {/* Mobile bottom navigation (touch-optimized, app-like) */}
      <nav
        aria-label="Mobile bottom"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-color)] bg-[var(--card)]/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex h-14 max-w-lg items-stretch">
          {bottomNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${
                  active
                    ? "text-[var(--foreground)] font-semibold"
                    : "text-[var(--muted-text)]"
                }`}
              >
                <span className="relative">
                  {item.label === "Home" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 10.5L12 3l9 7.5" />
                      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
                    </svg>
                  )}
                  {item.label === "Companies" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                  )}
                  {item.label === "Compare" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 3v18M17 3v18M3 7h4M3 17h4M17 7h4M17 17h4" />
                    </svg>
                  )}
                  {item.label === "Tools" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                  {item.label === "Saved" && (
                    <span className="relative">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z" />
                      </svg>
                      {totalSaved > 0 && (
                        <span className="absolute -right-2 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--accent)] px-0.5 text-[9px] font-bold text-white">
                          {totalSaved}
                        </span>
                      )}
                    </span>
                  )}
                </span>
                {item.label}
                {active && (
                  <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-[var(--foreground)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
