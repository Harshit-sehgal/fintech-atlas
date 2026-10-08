import type { ReactNode } from "react";
import { Highlight } from "./highlight";

/**
 * Wraps every case-insensitive occurrence of `query` inside `text` with the
 * marker swipe. This is the highlighter's functional role: in a 3,000-company
 * directory the user needs to *see* why a row matched, not just that it did.
 *
 * `animate` is off — lists can hold hundreds of these, and a scroll-triggered
 * sweep per match would be noise (and hundreds of observers).
 */
export function HighlightedText({
  text,
  query,
  color = "yellow",
}: {
  text: string;
  query?: string;
  color?: "yellow" | "green" | "pink";
}): ReactNode {
  const q = query?.trim();
  if (!q) return text;

  const haystack = text.toLowerCase();
  const needle = q.toLowerCase();
  const parts: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  while (cursor < text.length) {
    const at = haystack.indexOf(needle, cursor);
    if (at < 0) {
      parts.push(text.slice(cursor));
      break;
    }
    if (at > cursor) parts.push(text.slice(cursor, at));
    parts.push(
      <Highlight key={key++} color={color} animate={false}>
        {text.slice(at, at + q.length)}
      </Highlight>,
    );
    cursor = at + q.length;
  }

  return <>{parts}</>;
}
