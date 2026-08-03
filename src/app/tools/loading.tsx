import { SkeletonCard } from "@/components/ui/skeleton";

export default function ToolsLoading() {
  return (
    <div className="space-y-8">
      {/* Tools overview cards */}
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard
            key={i}
            titleWidth="50%"
            contentWidth="100%"
            className="animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}