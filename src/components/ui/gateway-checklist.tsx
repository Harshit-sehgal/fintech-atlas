"use client";

import { useEffect, useMemo, useState } from "react";

export interface ChecklistGroup {
  id: string;
  title: string;
  items: string[];
}

const STORAGE_KEY = "fintech-atlas:gateway-checklist";

/**
 * Interactive implementation checklist (plan T062). State persists to
 * localStorage so a merchant can track integration progress across visits;
 * fully client-side, no backend.
 */
export function GatewayChecklist({ groups }: { groups: ChecklistGroup[] }) {
  const flatIds = useMemo(
    () => groups.flatMap((g) => g.items.map((item) => `${g.id}:${item}`)),
    [groups],
  );
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Defer past the synchronous effect body so the renderer's
    // set-state-in-effect rule stays satisfied; state then settles on the
    // next frame without a cascading render.
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored = JSON.parse(raw) as string[];
          setChecked(new Set(stored.filter((id) => flatIds.includes(id))));
        }
      } catch {
        // Corrupt or unavailable storage — start empty.
      }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [flatIds]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
    } catch {
      // Storage full or blocked — in-memory state still works for the session.
    }
  }, [checked, hydrated]);

  const doneCount = checked.size;
  const pct = flatIds.length === 0 ? 0 : Math.round((doneCount / flatIds.length) * 100);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function reset() {
    setChecked(new Set());
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-4">
        <div className="flex items-center gap-3">
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Checklist completion"
            className="h-2 w-32 overflow-hidden rounded-full bg-[var(--subtle-bg)]"
          >
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-[var(--muted-text)]">
            <strong className="text-[var(--foreground)]">
              {doneCount}/{flatIds.length}
            </strong>{" "}
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="btn-ghost text-xs"
          disabled={doneCount === 0}
        >
          Reset checklist
        </button>
      </div>

      {groups.map((group) => {
        const groupDone = group.items.filter((item) => checked.has(`${group.id}:${item}`)).length;
        return (
          <section
            key={group.id}
            aria-labelledby={`chk-${group.id}`}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--card)] p-5"
          >
            <h2 id={`chk-${group.id}`} className="flex items-center justify-between text-sm font-bold text-[var(--foreground)]">
              {group.title}
              <span className="font-mono text-xs font-normal text-[var(--muted-text)]">
                {groupDone}/{group.items.length}
              </span>
            </h2>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => {
                const id = `${group.id}:${item}`;
                const isChecked = checked.has(id);
                return (
                  <li key={id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--subtle-bg)]">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(id)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                      />
                      <span
                        className={`text-sm leading-relaxed ${
                          isChecked ? "text-[var(--muted-text)] line-through decoration-[var(--muted-text)]/50" : "text-[var(--foreground)]"
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
