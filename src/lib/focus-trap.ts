/**
 * Shared focus-trap utilities for modal dialogs and the command palette.
 * Extracted from duplicated implementations in companies/[id]/client.tsx
 * and command-palette.tsx to keep focus management in one place.
 */

/**
 * Returns all focusable elements inside the given container element.
 * Sorted by tabindex (ascending, positives first) then DOM order, with
 * duplicates and invisible elements removed.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
    '[contenteditable]:not([contenteditable="false"])',
  ];

  const focusableElements: HTMLElement[] = [];
  focusableSelectors.forEach((selector) => {
    const elements = container.querySelectorAll<HTMLElement>(selector);
    elements.forEach((el) => {
      if (container.contains(el)) focusableElements.push(el);
    });
  });

  // Remove duplicates, then sort by tabindex then DOM order, excluding any
  // element that is not actually visible / focusable to the user.
  return [...new Set(focusableElements)]
    .filter(isElementVisible)
    .sort((a, b) => {
      if (a === b) return 0;
      const tabA = parseInt(a.getAttribute("tabindex") || "0", 10) || 0;
      const tabB = parseInt(b.getAttribute("tabindex") || "0", 10) || 0;
      // Explicit positive tabindex values are reached first (ascending),
      // then tabindex 0 elements in document order.
      const posA = tabA > 0;
      const posB = tabB > 0;
      if (posA !== posB) return posA ? -1 : 1;
      if (tabA !== tabB) return tabA - tabB;
      // compareDocumentPosition(a, b) includes DOCUMENT_POSITION_FOLLOWING (4)
      // when b follows a (i.e. a comes FIRST in the document) → return -1.
      // (The previous code read DOCUMENT_POSITION_PRECEDING, which reversed it.)
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
}

/**
 * Returns true when the element can visibly receive focus: not `display:none`,
 * not `visibility:hidden`, not inside `inert` or an `aria-hidden` subtree, and
 * has a non-zero layout box.
 */
function isElementVisible(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (element.closest("[inert]")) return false;
  if (element.closest('[aria-hidden="true"]')) return false;
  // jsdom does not calculate layout boxes; its elements are still useful for
  // unit tests and browser-independent focus ordering. Real browsers use the
  // rect check to exclude detached/zero-size nodes.
  return typeof window !== "undefined" && navigator.userAgent.includes("jsdom")
    ? true
    : element.getClientRects().length > 0;
}

/**
 * Return focusable descendants for a supplied dialog. Keeping the container
 * explicit avoids global-selector collisions when more than one dialog exists.
 */
export function getFocusableElementsInDialog(dialog: HTMLElement): HTMLElement[] {
  return getFocusableElements(dialog);
}