export default function ArticleLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 h-4 w-48 rounded bg-panel-hover" />

      {/* Header Skeleton */}
      <div className="mb-8 border-b border-theme pb-6">
        <div className="mb-4 h-10 w-3/4 rounded bg-panel-hover sm:h-12" />
        <div className="mb-4 h-6 w-full rounded bg-panel-hover" />
        <div className="mb-4 h-6 w-2/3 rounded bg-panel-hover" />
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-full bg-panel-hover" />
          <div className="h-8 w-24 rounded-full bg-panel-hover" />
          <div className="h-8 w-24 rounded-full bg-panel-hover" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <div className="h-8 w-1/2 rounded bg-panel-hover" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-panel-hover" />
          <div className="h-4 w-full rounded bg-panel-hover" />
          <div className="h-4 w-3/4 rounded bg-panel-hover" />
        </div>
        <div className="h-8 w-1/3 rounded bg-panel-hover" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-panel-hover" />
          <div className="h-4 w-full rounded bg-panel-hover" />
          <div className="h-4 w-5/6 rounded bg-panel-hover" />
        </div>
        <div className="h-64 w-full rounded-xl bg-panel-hover" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-panel-hover" />
          <div className="h-4 w-full rounded bg-panel-hover" />
          <div className="h-4 w-2/3 rounded bg-panel-hover" />
        </div>
      </div>
    </div>
  );
}
