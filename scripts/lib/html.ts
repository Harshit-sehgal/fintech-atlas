const NAMED_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&nbsp;": " ",
  "&ndash;": "-",
  "&mdash;": "-",
  "&lsquo;": "'",
  "&rsquo;": "'",
  "&ldquo;": '"',
  "&rdquo;": '"',
  "&quot;": '"',
  "&apos;": "'",
  "&#8486;": "Ω",
  "&#39;": "'",
};

const ENTITY_PATTERN = /&(?:#x[\da-fA-F]+|#\d+|[a-z]+);/g;

/**
 * Decodes HTML character references in a single pass.
 *
 * Chained `String.replace(/&amp;/g, "&")` calls can double-unescape values
 * such as `&amp;amp;` (→ `&` instead of `&amp;`). Replacing all entities in
 * one pass keeps decoded `&` characters literal and satisfies the
 * js/html-entity-unescaping rule.
 */
export function decodeHtmlEntities(value: string): string {
  return value.replace(ENTITY_PATTERN, (match) => {
    if (Object.hasOwn(NAMED_ENTITIES, match)) return NAMED_ENTITIES[match];
    if (match[1] === "#") {
      const body = match.slice(2, -1);
      const hex = body[0] === "x" || body[0] === "X";
      const code = parseInt(body.slice(hex ? 1 : 0), hex ? 16 : 10);
      if (!Number.isNaN(code) && code >= 0) return String.fromCodePoint(code);
    }
    return match;
  });
}