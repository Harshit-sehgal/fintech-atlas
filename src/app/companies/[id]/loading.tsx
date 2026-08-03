import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function CompanyLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <Skeleton width="80" height="80" className="rounded-full" />
        <div className="space-y-3">
          <Skeleton width="40%" height="2rem" className="mb-2" />
          <Skeleton width="60%" height="1.5rem" />
          <Skeleton width="50%" height="1.25rem" className="mt-1" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            width="100%"
            height="2.5rem"
            className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
          />
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Overview */}
        <div className="space-y-3">
          <Skeleton width="100%" height="1.5rem" />
          <SkeletonText width="100%" count={3} />
        </div>

        {/* Offerings */}
        <div className="space-y-3">
          <Skeleton width="100%" height="1.5rem" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                width="100%"
                height="3rem"
                className="bg-[var(--muted-bg)]/50 rounded-lg border border-[var(--border-color)]/50"
              />
            ))}
          </div>
        </div>

        {/* Scorecard */}
        <div className="space-y-3">
          <Skeleton width="100%" height="1.5rem" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                width="100%"
                height="1.75rem"
                className="flex items-center space-x-2"
              />
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-3">
          <Skeleton width="100%" height="1.5rem" />
          <SkeletonText width="100%" count={4} />
        </div>

        {/* Strengths/Weaknesses */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <Skeleton width="100%" height="1.5rem" />
            <SkeletonText width="70%" count={3} />
          </div>
          <div className="space-y-3">
            <Skeleton width="100%" height="1.5rem" />
            <SkeletonText width="70%" count={3} />
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          <Skeleton width="100%" height="1.5rem" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                width="100%"
                height="4rem"
                className="bg-[var(--muted-bg)]/50 rounded-lg border border-[var(--border-color)]/50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}