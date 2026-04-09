"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      console.error("Application error:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-theme">Oops!</h1>
        <h2 className="mt-4 text-2xl font-semibold text-muted">
          Something went wrong
        </h2>
        <p className="mt-2 text-muted/80 max-w-md">
          An unexpected error occurred while rendering this page. The issue has
          been logged and our team is investigating.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-theme bg-panel px-6 py-2.5 font-medium text-theme hover:bg-panel-hover transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="rounded-lg bg-theme px-6 py-2.5 font-medium text-panel hover:bg-theme/90 transition-colors"
          >
            Go Home
          </a>
        </div>
        {process.env.NODE_ENV === "development" && error?.message && (
          <details className="mt-8 text-left max-w-lg mx-auto">
            <summary className="cursor-pointer text-sm text-muted/60">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs text-muted/80 whitespace-pre-wrap break-words bg-panel-soft p-4 rounded-lg">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
