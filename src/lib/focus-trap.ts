/**
 * Shared focus-trap utilities for modal dialogs and the command palette.
 * Extracted from duplicated implementations in companies/[id]/client.tsx
 * and command-palette.tsx to keep focus management in one place.
 */

/**
 * Returns all focusable elements inside the given container element.
 * Sorted by tabindex then DOM order, with duplicates removed.
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
      if (container.contains(el)) {
        focusableElements.push(el);
      }
    });
  });

  // Sort by tabindex and DOM order
  return focusableElements
    .sort((a, b) => {
      const tabA = parseInt(a.getAttribute("tabindex") || "0");
      const tabB = parseInt(b.getAttribute("tabindex") || "0");
      if (tabA !== tabB) return tabA - tabB;
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1;
    })
    .filter((elem, index, self) => index === self.findIndex((e) => e === elem));
}

/**
 * Convenience wrapper that looks up the current modal dialog and returns
 * its focusable descendants. Returns [] when no dialog is present.
 */
export function getFocusableElementsInDialog(): HTMLElement[] {
  const dialog = document.querySelector('[role="dialog"][aria-modal="true"]') as HTMLElement | null;
  if (!dialog) return [];
  return getFocusableElements(dialog);
}