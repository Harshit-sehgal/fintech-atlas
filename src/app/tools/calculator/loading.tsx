import { Skeleton } from "@/components/ui/skeleton";

export default function CalculatorLoading() {
  return (
    <div className="space-y-8">
      {/* Input Controls */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <input
            type="range"
            min="1000"
            max="500000"
            step="1000"
            defaultValue="25000"
            className="w-full animate-pulse opacity-50"
            disabled
          />
          <div className="flex justify-between text-[11px] text-[var(--muted-text)] mt-1 font-mono">
            <span>$1k</span>
            <span>$100k</span>
            <span>$500k</span>
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <input
            type="range"
            min="5"
            max="500"
            step="5"
            defaultValue="50"
            className="w-full animate-pulse opacity-50"
            disabled
          />
          <div className="flex justify-between text-[11px] text-[var(--muted-text)] mt-1 font-mono">
            <span>$5 (Micropayments)</span>
            <span>$50</span>
            <span>$500</span>
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            defaultValue="10"
            className="w-full animate-pulse opacity-50"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            defaultValue="0"
            className="w-full animate-pulse opacity-50"
            disabled
          />
        </div>

        {/* Summary stats */}
        <div className="space-y-2">
          <Skeleton width="100%" height="1.5rem" />
          <Skeleton width="100%" height="1.5rem" />
          <Skeleton width="100%" height="1.5rem" />
        </div>
      </div>

      {/* Results & Bar Comparison */}
      <div className="space-y-6">
        {/* Recommendation */}
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-1">
            <Skeleton width="100%" height="1.5rem" className="mb-1" />
            <Skeleton width="30%" height="1rem" />
          </div>
          <Skeleton width="20%" height="3rem" className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50" />
        </div>

        {/* Providers list */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="6rem"
              className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}