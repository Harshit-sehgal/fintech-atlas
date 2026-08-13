"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { getFocusableElementsInDialog } from "@/lib/focus-trap";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/data/categories";
import { glossary } from "@/data/glossary";
import { companySummaries } from "@/generated/company-summaries";
import { articleSummaries } from "@/generated/article-summaries";
import { fuzzyRank } from "@/lib/fuzzy";
import { CompanyLogo } from "./company-logo";
import { CategoryIcon } from "./category-icon";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keep the keyboard-selected row visible inside the scrollable listbox.
  // Without this, ArrowDown past the visible viewport moves the highlight off
  // screen and the user loses their place — a common combobox a11y gap.
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const el = itemRefs.current[selectedIndex];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Focus management for accessibility
  const previousElementRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Save the currently focused element
      previousElementRef.current = document.activeElement as HTMLElement;

      // Focus the input when modal opens
      inputRef.current?.focus();

      // Trap focus inside the modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          onClose();
        } else if (e.key === "Escape") {
          onClose();
        } else if (e.key === "Tab") {
          // Trap focus within the modal
          const dialog = dialogRef.current;
          const focusableElements = dialog ? getFocusableElementsInDialog(dialog) : [];
          if (focusableElements.length === 0) {
            e.preventDefault();
            return;
          }

          const first = focusableElements[0];
          const last = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else { // Tab
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      const handleFocusIn = (e: FocusEvent) => {
        const dialog = dialogRef.current;
        const target = e.target;
        if (dialog && target instanceof Node && !dialog.contains(target)) {
          getFocusableElementsInDialog(dialog)[0]?.focus();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("focusin", handleFocusIn);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("focusin", handleFocusIn);

        // Return focus to the element that triggered the modal
        if (previousElementRef.current) {
          previousElementRef.current.focus();
        }
      };
    }
    return;
  }, [open, onClose]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    // Reset selection to the top and drop stale button refs from the previous
    // result set so the scroll-to-selected effect targets the new list.
    setSelectedIndex(0);
    itemRefs.current = [];
  };

  const handleSelect = (index: number) => {
    const selected = items[index];
    if (!selected) return;

    onClose();
    if (selected.type === "tool") router.push(selected.item.path);
    else if (selected.type === "company") router.push(`/companies/${selected.item.slug}`);
    else if (selected.type === "category") router.push(`/categories/${selected.item.slug}`);
    else if (selected.type === "glossary") router.push(`/glossary#${selected.item.slug}`);
    else if (selected.type === "article") router.push(`/articles/${selected.item.slug}`);
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, items.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
    } else if (e.key === "Enter" && items.length > 0) {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  const cleanQuery = query.trim().toLowerCase();

  // Memoize expensive filtering operations to prevent recomputation on every render.
  // When the user has typed nothing (cleanQuery === ""), skip creating intermediate
  // filtered arrays — every item matches, so we can directly map the raw lists.
  const filteredCompanies = useMemo(() => {
    if (cleanQuery === "") return companySummaries;
    return fuzzyRank(
      companySummaries,
      cleanQuery,
      (c) => [c.name, c.tagline, c.searchTerms],
    );
  }, [cleanQuery]);

  const filteredCategories = useMemo(() => {
    if (cleanQuery === "") return categories;
    return fuzzyRank(categories, cleanQuery, (cat) => [cat.name, cat.short]);
  }, [cleanQuery]);

  const filteredGlossary = useMemo(() => {
    if (cleanQuery === "") return glossary;
    return fuzzyRank(glossary, cleanQuery, (g) => [
      g.term,
      g.short,
      "full" in g && g.full ? g.full : "",
    ]);
  }, [cleanQuery]);

  const tools = useMemo(() => [
    { name: "Personal Finance Calculators", path: "/tools/calculators", desc: "SIP, SWP, EMI, CAGR, retirement, FIRE, net worth & emergency fund" },
    { name: "Payment Gateway Fee Estimator", path: "/tools/calculator", desc: "Compare processing costs across Stripe, PayPal, Square & Adyen" },
    { name: "Razorpay Fee Calculator (India)", path: "/tools/razorpay-fee-calculator", desc: "2% domestic + 18% GST, international up to 3%, reverse-charge formula" },
    { name: "Cross-Border Remittance Calculator", path: "/tools/remittance", desc: "Compare FX & transfer fees for international money transfers" },
    { name: "Exchange-Rate Markup Calculator", path: "/tools/exchange-rate-markup-calculator", desc: "Measure the hidden FX spread on any transfer, both directions" },
    { name: "FinTech Matchmaker Quiz", path: "/tools/matchmaker", desc: "Find the best financial tool suited for your business or personal needs" },
    { name: "Side-by-Side Comparison", path: "/compare", desc: "Compare companies side-by-side" },
    { name: "Saved Bookmarks", path: "/bookmarks", desc: "View your bookmarked companies and glossary terms" },
    { name: "Gateway Selection Audit", path: "/services", desc: "Paid, independent gateway recommendations for Indian businesses" },
    { name: "Sample Audit Report", path: "/services/gateway-selection-report-sample", desc: "See exactly what the paid gateway audit delivers" },
    { name: "Gateway Implementation Checklist", path: "/services/payment-gateway-implementation-checklist", desc: "Pre-flight to go-live checklist with saved progress" },
  ], []);

  const filteredTools = useMemo(() => {
    if (cleanQuery === "") return tools;
    return fuzzyRank(tools, cleanQuery, (t) => [t.name, t.desc]);
  }, [cleanQuery, tools]);

  const filteredArticles = useMemo(() => {
    if (cleanQuery === "") return articleSummaries;
    return fuzzyRank(articleSummaries, cleanQuery, (article) => [
      article.title,
      article.description,
      article.category,
      ...article.relatedCompanySlugs,
    ]);
  }, [cleanQuery]);

  // Keep the empty palette useful without rendering the entire catalogue. When
  // searching, cap each group so keyboard navigation remains quick and the
  // first results stay predictable for this small editorial catalogue.
  const visibleTools = filteredTools.slice(0, cleanQuery ? 20 : 4);
  const visibleCompanies = filteredCompanies.slice(0, cleanQuery ? 20 : 4);
  const visibleCategories = filteredCategories.slice(0, cleanQuery ? 20 : 2);
  const visibleGlossary = filteredGlossary.slice(0, cleanQuery ? 20 : 2);
  const visibleArticles = filteredArticles.slice(0, cleanQuery ? 20 : 2);

  const items = [
    ...visibleTools.map((t) => ({ type: "tool" as const, item: t, id: `tool-${t.path}` })),
    ...visibleCompanies.map((c) => ({ type: "company" as const, item: c, id: `company-${c.slug}` })),
    ...visibleCategories.map((cat) => ({ type: "category" as const, item: cat, id: `cat-${cat.slug}` })),
    ...visibleGlossary.map((g) => ({ type: "glossary" as const, item: g, id: `glossary-${g.slug}` })),
    ...visibleArticles.map((article) => ({ type: "article" as const, item: article, id: `article-${article.slug}` })),
  ];

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2 }}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--background)] shadow-2xl"
        >
          {/* Input field */}
          <div className="flex items-center border-b border-[var(--border-color)] px-4 py-3.5">
            <svg className="mr-3 h-5 w-5 text-[var(--muted-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              autoFocus
              role="combobox"
              aria-controls="command-palette-listbox"
              aria-expanded={open}
              aria-autocomplete="list"
              aria-activedescendant={items[selectedIndex] ? `command-option-${items[selectedIndex].id}` : undefined}
              placeholder="Search companies, categories, glossary terms, articles, or tools... (Esc to close)"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDownInInput}
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-text)]"
            />
            <kbd className="hidden sm:inline-block rounded bg-[var(--subtle-bg)] px-2 py-0.5 text-xs text-[var(--muted-text)] font-mono">
              ESC
            </kbd>
          </div>

          {/* Result list */}
          <div id="command-palette-listbox" role="listbox" className="max-h-[60vh] overflow-y-auto p-2">
            {items.length === 0 ? (
              <div className="p-8 text-center text-sm text-[var(--muted-text)]">
                No results found for &ldquo;{query}&rdquo;. Try searching for &ldquo;Stripe&rdquo;, &ldquo;Payments&rdquo;, or &ldquo;Calculator&rdquo;.
              </div>
            ) : (
              <div className="space-y-1">
                {items.map((entry, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={entry.id}
                      id={`command-option-${entry.id}`}
                      ref={(el) => { itemRefs.current[idx] = el; }}
                      onClick={() => handleSelect(idx)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      role="option"
                      aria-selected={isSelected}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] focus-visible:bg-[var(--subtle-bg)] ${
                        isSelected
                          ? "bg-[var(--subtle-bg)] text-[var(--foreground)] font-medium"
                          : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
                      }`}
                      aria-label={`Go to ${entry.type}: ${entry.type === "company" ? entry.item.name : entry.type === "category" ? entry.item.name : entry.type === "glossary" ? entry.item.term : entry.type === "tool" ? entry.item.name : entry.type === "article" ? entry.item.title : ""}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {entry.type === "tool" && (
                          <span className="flex h-7 w-7 items-center justify-center rounded bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold shrink-0">
                            ⚙️
                          </span>
                        )}
                        {entry.type === "company" && (
                          <CompanyLogo slug={entry.item.slug} name={entry.item.name} size={28} />
                        )}
                        {entry.type === "category" && (
                          <CategoryIcon icon={entry.item.icon} color={entry.item.accent} size={28} />
                        )}
                        {entry.type === "glossary" && (
                          <span className="flex h-7 w-7 items-center justify-center rounded bg-[var(--success)]/10 text-success-text font-mono text-xs font-bold shrink-0">
                            📖
                          </span>
                        )}
                        {entry.type === "article" && (
                          <span className="flex h-7 w-7 items-center justify-center rounded bg-[var(--accent)]/10 text-[var(--accent)] font-mono text-xs font-bold shrink-0">
                            ◫
                          </span>
                        )}

                        <div className="truncate">
                          <span className="text-[var(--foreground)]">
                            {entry.type === "company" && entry.item.name}
                            {entry.type === "category" && entry.item.name}
                            {entry.type === "glossary" && entry.item.term}
                            {entry.type === "tool" && entry.item.name}
                            {entry.type === "article" && entry.item.title}
                          </span>
                          <span className="ml-2 text-xs text-[var(--muted-text)] truncate">
                            {entry.type === "company" && entry.item.tagline}
                            {entry.type === "category" && entry.item.short}
                            {entry.type === "glossary" && entry.item.short}
                            {entry.type === "tool" && entry.item.desc}
                            {entry.type === "article" && entry.item.description}
                          </span>
                        </div>
                      </div>

                      <span className="ml-2 shrink-0 rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--muted-text)] bg-[var(--border-color)]">
                        {entry.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer instruction */}
          <div className="flex items-center justify-between border-t border-[var(--border-color)] px-4 py-2 text-xs text-[var(--muted-text)] bg-[var(--subtle-bg)]/40">
            <div className="flex items-center gap-2">
              <span>Navigate <kbd className="font-mono bg-[var(--border-color)] px-1 rounded">↑</kbd><kbd className="font-mono bg-[var(--border-color)] px-1 rounded">↓</kbd></span>
              <span>Select <kbd className="font-mono bg-[var(--border-color)] px-1 rounded">↵</kbd></span>
            </div>
            <span>FinTech Atlas Command Palette</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
