import { Skeleton } from "@/components/ui/skeleton";

export default function RemittanceLoading() {
  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="space-y-6">
        {/* Amount slider */}
        <div className="space-y-2">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <input
            type="range"
            min="100"
            max="20000"
            step="100"
            defaultValue="1000"
            className="w-full animate-pulse opacity-50"
            disabled
          />
          <div className="flex justify-between text-[11px] text-[var(--muted-text)] mt-1 font-mono">
            <span>$100</span>
            <span>$5,000</span>
            <span>$20,000</span>
          </div>
        </div>

        {/* Currency picker */}
        <div className="space-y-2">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton
                key={i}
                width="100%"
                height="5rem"
                className="bg-[var(--muted-bg)]/50 rounded-lg border border-[var(--border-color)]/50"
              />
            ))}
          </div>
        </div>

        {/* FX Benchmark */}
        <div className="space-y-2">
          <Skeleton width="100%" height="1.5rem" className="mb-1" />
          <Skeleton width="50%" height="1.5rem" />
        </div>
      </div>

      {/* Comparison output */}
      <div className="space-y-6">
        {/* Received amount */}
        <div className="flex items-center justify-between space-x-4">
          <div className="space-y-1">
            <Skeleton width="100%" height="1.5rem" className="mb-1" />
            <Skeleton width="30%" height="1rem" />
          </div>
          <Skeleton width="20%" height="3rem" className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50" />
        </div>

        {/* Provider table */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height="10rem"
              className="bg-[var(--muted-bg)]/50 rounded-xl border border-[var(--border-color)]/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}