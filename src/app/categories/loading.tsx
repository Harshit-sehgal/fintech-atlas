import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      {/* Categories grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  );
}