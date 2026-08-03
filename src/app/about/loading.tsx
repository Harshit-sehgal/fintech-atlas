import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <Skeleton width="40%" height="2rem" className="mb-2" />
        <Skeleton width="30%" height="1.5rem" />
      </div>

      {/* Mission & Methodology */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <SkeletonText width="100%" count={4} className="mb-4" />
        </div>
        <div className="space-y-4">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <SkeletonText width="100%" count={4} className="mb-4" />
        </div>
      </div>

      {/* Data Sources */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <SkeletonText width="100%" count={3} className="mb-4" />
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                width="100%"
                height="1.5rem"
                className="mb-2"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton width="100%" height="1.5rem" className="mb-2" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                width="100%"
                height="1.5rem"
                className="mb-2"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}