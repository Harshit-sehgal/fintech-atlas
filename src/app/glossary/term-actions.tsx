"use client";

import { useBookmarks } from "@/lib/bookmarks-context";
import { useToast } from "@/lib/toast-context";

/** Bookmark + copy-link actions for one server-rendered glossary card. */
export function TermActions({ slug, term }: { slug: string; term: string }) {
  const { isGlossaryBookmarked, toggleGlossaryBookmark } = useBookmarks();
  const { showToast } = useToast();

  const bookmarked = isGlossaryBookmarked(slug);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/glossary#${slug}`;
    navigator.clipboard.writeText(url).then(
      () => showToast("Direct link copied to clipboard!", "success"),
      () => showToast("Couldn't copy the link — clipboard access was blocked.", "error"),
    );
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => {
          toggleGlossaryBookmark(slug);
          showToast(
            bookmarked ? `Removed ${term} from saved terms` : `Saved ${term} to glossary bookmarks!`,
            bookmarked ? "info" : "success",
          );
        }}
        className={`text-sm p-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-[var(--ring)] ${
          bookmarked
            ? "text-warning-text bg-warning/10"
            : "text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--subtle-bg)] focus-visible:bg-[var(--subtle-bg)] focus-visible:text-[var(--foreground)]"
        }`}
        title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
        aria-label={bookmarked ? `Remove ${term} bookmark` : `Save ${term} bookmark`}
      >
        {bookmarked ? "★" : "☆"}
      </button>
      <button
        onClick={handleCopyLink}
        className="text-xs text-[var(--muted-text)] hover:text-[var(--foreground)] p-1.5 rounded-full hover:bg-[var(--subtle-bg)] focus-visible:bg-[var(--subtle-bg)] focus-visible:text-[var(--foreground)] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-[var(--ring)] transition-opacity"
        title="Copy Link"
        aria-label={`Copy link to ${term}`}
      >
        🔗
      </button>
    </div>
  );
}
