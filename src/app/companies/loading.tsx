import { Skeleton } from "@/components/ui/skeleton";

export default function CompaniesLoading() {
  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="mb-6">
        <div className="space-y-2">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton
                key={i}
                width="20%"
                height="1.5rem"
                className="bg-[var(--muted-bg)]/50 rounded-lg border border-[var(--border-color)]/50"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton width="100%" height="1.5rem" className="flex-shrink-0" />
          <Skeleton width="100%" height="1.5rem" className="flex-shrink-0" />
        </div>
      </div>

      {/* Sort and view toggle */}
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-center gap-2">
          <Skeleton width="100%" height="1.5rem" className="flex-shrink-0" />
          <Skeleton width="100%" height="1.5rem" className="flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton width="80px" height="32px" className="flex-shrink-0" />
          <Skeleton width="80px" height="32px" className="flex-shrink-0" />
        </div>
      </div>

      {/* Companies grid */}
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="12rem"
              className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>

      {/* Empty state placeholder (skeleton version) */}
      <div className="text-center py-12">
        <Skeleton width="30%" height="1.5rem" className="mb-3" />
        <Skeleton width="40%" height="1.5rem" className="mb-4" />
        <Skeleton width="50%" height="1.5rem" className="mb-4" />
        <Skeleton width="40%" height="1.5rem" />
      </div>
    </div>
  );
}