import type { ReactNode } from "react";

/**
 * Shared empty-state panel for filtered surfaces (T111 / finding U3).
 * Every instance must offer a recovery action — usually "Clear filters" —
 * so a dead-end result list always has an obvious way out.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="py-10 text-center">
      <p className="mx-auto w-fit text-sm font-medium text-[var(--foreground)]">
        <span className="hl hl-yellow">{title}</span>
      </p>
      {description && (
        <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-[var(--muted-text)]">
          {description}
        </p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
