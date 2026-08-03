import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 md:py-28" aria-busy="true" aria-label="Loading homepage">
      <Skeleton width="12rem" height="2.5rem" />
      <Skeleton width="100%" height="4rem" className="mt-6 max-w-2xl" />
      <Skeleton width="80%" height="1.5rem" className="mt-4 max-w-xl" />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
