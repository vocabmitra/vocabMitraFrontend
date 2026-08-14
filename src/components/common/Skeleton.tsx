interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
  rounded?: string;
}

export function Skeleton({
  className = '',
  height = 'h-4',
  width = 'w-full',
  rounded = 'rounded-md',
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${height} ${width} ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
}

/** Pre-built VocabCard skeleton for the catalog grid */
export function VocabCardSkeleton() {
  return (
    <div
      className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-[22px_20px]"
      aria-hidden="true"
    >
      <Skeleton height="h-6" width="w-3/5" className="mb-2" />
      <Skeleton height="h-4" width="w-full" className="mb-1" />
      <Skeleton height="h-4" width="w-4/5" className="mb-3" />
      <Skeleton height="h-4" width="w-16" rounded="rounded-full" />
    </div>
  );
}
