import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton width="30%" height="1.5rem" className="mb-2" />
        <Skeleton width="50%" height="1.5rem" />
      </div>

      {/* Companies section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton width="100%" height="1.5rem" />
          <Skeleton width="30%" height="1.125rem" className="text-xs" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="10rem"
              className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>

      {/* Glossary section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton width="100%" height="1.5rem" />
          <Skeleton width="30%" height="1.125rem" className="text-xs" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="4rem"
              className="bg-[var(--muted-bg)]/50 rounded-lg border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>

      {/* Other categories section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton width="100%" height="1.5rem" />
          <Skeleton width="30%" height="1.125rem" className="text-xs" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton
              key={i}
              width="25%"
              height="2rem"
              className="bg-[var(--muted-bg)]/50 rounded-lg border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}