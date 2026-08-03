"use client";

import React, { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { useToast } from "@/lib/toast-context";
import {
  BOOKMARKS_KEY,
  GLOSSARY_BOOKMARKS_KEY,
  STORAGE_EVENT,
  parseStoredList,
} from "@/lib/storage";
import { toggleListValue } from "@/lib/list-utils";

interface BookmarksContextType {
  bookmarks: string[];
  toggleBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  glossaryBookmarks: string[];
  toggleGlossaryBookmark: (slug: string) => void;
  isGlossaryBookmarked: (slug: string) => boolean;
}

// Undefined so a component accidentally rendered outside the provider fails
// loudly (a useful dev error) instead of silently no-op'ing.
const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

function readStorage(key: string): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function subscribeToStorage(key: string, onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === null || event.key === key) onStoreChange();
  };
  const handleLocalChange = (event: Event) => {
    if ((event as CustomEvent<{ key?: string }>).detail?.key === key) onStoreChange();
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(STORAGE_EVENT, handleLocalChange);
  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(STORAGE_EVENT, handleLocalChange);
  };
}

function writeStorage(key: string, values: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(values));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }));
}

function useStoredList(key: string): [string[], (slug: string) => void] {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeToStorage(key, onStoreChange),
    [key],
  );
  const getSnapshot = useCallback(() => readStorage(key), [key]);
  const rawValue = useSyncExternalStore(subscribe, getSnapshot, () => "");

  const values = parseStoredList(rawValue);
  const toggle = (slug: string) => {
    const current = parseStoredList(readStorage(key));
    writeStorage(key, toggleListValue(current, slug));
  };

  return [values, toggle];
}

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [bookmarks, toggleBookmark] = useStoredList(BOOKMARKS_KEY);
  const [glossaryBookmarks, toggleGlossaryBookmark] = useStoredList(GLOSSARY_BOOKMARKS_KEY);

  const safeToggle = (key: string, toggle: (slug: string) => void, slug: string) => {
    try {
      toggle(slug);
    } catch {
      showToast(`Failed to save ${key} to local storage`, "error");
    }
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        toggleBookmark: (slug) => safeToggle("bookmarks", toggleBookmark, slug),
        isBookmarked: (slug) => bookmarks.includes(slug),
        glossaryBookmarks,
        toggleGlossaryBookmark: (slug) => safeToggle("glossary bookmarks", toggleGlossaryBookmark, slug),
        isGlossaryBookmarked: (slug) => glossaryBookmarks.includes(slug),
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks(): BookmarksContextType {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used inside a BookmarksProvider");
  }
  return context;
}
