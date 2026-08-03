import { Skeleton } from "@/components/ui/skeleton";

export default function MatchmakerLoading() {
  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <span>Question <span className="inline-block w-8 h-8 flex items-center justify-center bg-[var(--muted-bg)]/50 rounded-full text-[var(--muted-text)]">1</span> of 4</span>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full bg-[var(--muted-bg)]/50 ${i === 1 ? "bg-[var(--accent)]" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Question content */}
      <div className="space-y-6">
        <Skeleton width="100%" height="2rem" className="mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="4rem"
              className="bg-[var(--muted-bg)]/50 rounded-lg border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>

      {/* Results placeholder (for when quiz is complete) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-1">
            <Skeleton width="100%" height="1.5rem" className="mb-1" />
            <Skeleton width="30%" height="1rem" />
          </div>
          <Skeleton width="20%" height="3rem" className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50" />
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="8rem"
              className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}