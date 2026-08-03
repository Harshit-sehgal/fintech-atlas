import { Skeleton } from "@/components/ui/skeleton";

export default function GlossaryLoading() {
  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="mb-6">
        <div className="space-y-2">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                width="20%"
                height="1.5rem"
                className="bg-[var(--muted-bg)]/50 rounded-lg border border-[var(--border-color)]/50"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <div className="relative">
              <Skeleton
                width="80px"
                height="32px"
                className="relative"
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs text-[var(--muted-text)]">A</span>
            </div>
            {/* More letters */}
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                width="32px"
                height="32px"
                className="ml-2 rounded-lg border border-[var(--border-color)]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Glossary terms list */}
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="4rem"
              className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>

      {/* Empty state placeholder */}
      <div className="text-center py-12">
        <Skeleton width="30%" height="1.5rem" className="mb-3" />
        <Skeleton width="40%" height="1.5rem" className="mb-4" />
        <Skeleton width="50%" height="1.5rem" className="mb-4" />
        <Skeleton width="40%" height="1.5rem" />
      </div>
    </div>
  );
}