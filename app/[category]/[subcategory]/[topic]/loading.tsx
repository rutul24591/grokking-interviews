export default function ArticleLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs Skeleton */}
      <div className="mb-6 h-4 w-64 animate-pulse rounded bg-panel-soft" />

      {/* Header Skeleton */}
      <div className="mb-8 border-b border-theme pb-6">
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-panel-soft" />
          <div className="h-6 w-full animate-pulse rounded bg-panel-soft" />
          <div className="flex gap-3">
            <div className="h-8 w-24 animate-pulse rounded-full bg-panel-soft" />
            <div className="h-8 w-24 animate-pulse rounded-full bg-panel-soft" />
            <div className="h-8 w-24 animate-pulse rounded-full bg-panel-soft" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-8 w-1/2 animate-pulse rounded bg-panel-soft" />
          <div className="h-4 w-full animate-pulse rounded bg-panel-soft" />
          <div className="h-4 w-full animate-pulse rounded bg-panel-soft" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-panel-soft" />
        </div>

        <div className="space-y-3">
          <div className="h-8 w-1/2 animate-pulse rounded bg-panel-soft" />
          <div className="h-4 w-full animate-pulse rounded bg-panel-soft" />
          <div className="h-4 w-full animate-pulse rounded bg-panel-soft" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-panel-soft" />
        </div>

        <div className="h-64 animate-pulse rounded-lg bg-panel-soft" />

        <div className="space-y-3">
          <div className="h-8 w-1/2 animate-pulse rounded bg-panel-soft" />
          <div className="h-4 w-full animate-pulse rounded bg-panel-soft" />
          <div className="h-4 w-full animate-pulse rounded bg-panel-soft" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-panel-soft" />
        </div>
      </div>
    </div>
  );
}
