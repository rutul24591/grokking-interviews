// FeedSkeleton — Loading skeleton rows with shimmer animation.
// Shown during initial load and while fetching the next page.

'use client';

interface FeedSkeletonProps {
  /** Number of skeleton rows to render */
  count?: number;
  /** Height of each skeleton row in pixels */
  height?: number;
  /** CSS class for the skeleton container */
  className?: string;
}

export function FeedSkeleton({
  count = 5,
  height = 100,
  className = '',
}: FeedSkeletonProps) {
  const rows = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      className={className}
      role="status"
      aria-busy="true"
      aria-label="Loading more items"
    >
      {rows.map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg"
          style={{
            height: `${height}px`,
            marginBottom: i < rows.length - 1 ? '12px' : '0',
            background:
              'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%)',
            backgroundSize: '400% 100%',
            animation: 'skeleton-shimmer 1.4s ease-in-out infinite',
          }}
        />
      ))}
      {/* Inline keyframes for the shimmer animation */}
      <style>{`
        @keyframes skeleton-shimmer {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
