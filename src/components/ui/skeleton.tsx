"use client";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
}

/**
 * Skeleton loader placeholder for content that is loading.
 * Uses CSS variables for easy theming with light/dark mode.
 */
export function Skeleton({
  width = "100%",
  height = "1rem",
  className = "",
  animate = true,
}: SkeletonProps) {
  return (
    <div
      className={`block animate-pulse ${className}`}
      style={{
        width,
        height,
        backgroundColor: "var(--muted-bg)",
        borderRadius: "0.375rem",
        overflow: "hidden",
        ...(animate && {
          // Theme-aware shimmer: a faint foreground tint reads on both the
          // light and dark skeletons, where a hardcoded white highlight
          // washes out against the light `--muted-bg` surface.
          backgroundImage:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--foreground) 12%, transparent), transparent)",
          backgroundSize: "200% 100%",
          animation: "skeleton-loading 1.5s infinite",
        }),
      }}
    />
  );
}

/**
 * Skeleton text line for paragraphs or text content.
 */
export function SkeletonText({
  width = "100%",
  height = "1.25rem",
  className = "",
  count = 3,
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}) {
  return (
    <div className={`${className} space-y-2`}>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          width={i === count - 1 ? "60%" : width}
          height={height}
          className="mb-0"
        />
      ))}
    </div>
  );
}

/**
 * Skeleton card for loading card-like content.
 */
export function SkeletonCard({
  titleWidth = "60%",
  contentWidth = "100%",
  avatarSize = "3rem",
  className = "",
}: {
  titleWidth?: string | number;
  contentWidth?: string | number;
  avatarSize?: string | number;
  className?: string;
}) {
  return (
    <div className={`${className} rounded-xl border border-[var(--border-color)] p-6`}>
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <Skeleton width={avatarSize} height={avatarSize} className="rounded-full" />
          <div className="space-y-1">
            <Skeleton width={titleWidth} height="1.25rem" />
            <Skeleton width="40%" height="1rem" className="mt-1" />
          </div>
        </div>
      </div>
      <Skeleton width={contentWidth} height="8rem" className="mb-4" />
      <div className="space-y-2">
        <Skeleton width="70%" height="1rem" />
        <Skeleton width="50%" height="1rem" />
        <Skeleton width="80%" height="1rem" />
      </div>
    </div>
  );
}