import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarksLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton width="20%" height="1rem" className="mb-2" />
        <Skeleton width="50%" height="2rem" className="mb-2" />
        <Skeleton width="40%" height="1.25rem" />
      </div>

      {/* Compare bar placeholder */}
      <Skeleton
        width="100%"
        height="3rem"
        className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--accent)]/20"
      />

      {/* Saved Companies section */}
      <div className="space-y-4">
        <Skeleton width="30%" height="1.5rem" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="12rem"
              className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>

      {/* Saved Glossary section */}
      <div className="space-y-4">
        <Skeleton width="30%" height="1.5rem" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="5rem"
              className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}