import { Skeleton } from "@/components/ui/skeleton";

export default function CompareLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton width="40%" height="1.5rem" className="mb-2" />
        <Skeleton width="30%" height="1.5rem" />
      </div>

      {/* Company selectors */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            width="100%"
            height="3rem"
            className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
          />
        ))}
      </div>

      {/* Presets */}
      <div className="space-y-4">
        <Skeleton width="100%" height="1.5rem" className="mb-2" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              width="30%"
              height="1.5rem"
              className="bg-[var(--muted-bg)]/50 rounded-lg border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>

      {/* Comparison table placeholder */}
      <div className="space-y-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="4rem"
              className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
            />
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="1rem"
              className="mb-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
}