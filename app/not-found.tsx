import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-theme">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-muted">
          Page Not Found
        </h2>
        <p className="mt-2 text-muted/80 max-w-md">
          The article or page you&apos;re looking for doesn&apos;t exist. It may
          have been moved or the URL might be incorrect.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="rounded-lg bg-theme px-6 py-2.5 font-medium text-panel hover:bg-theme/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/articles/system-design/frontend-concepts/accessibility-a11y"
            className="rounded-lg border border-theme bg-panel px-6 py-2.5 font-medium text-theme hover:bg-panel-hover transition-colors"
          >
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
