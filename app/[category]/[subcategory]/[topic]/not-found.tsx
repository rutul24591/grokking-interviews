"use client";

import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-24 w-24 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-heading">
          Article Not Found
        </h1>
        <p className="mb-8 text-lg text-muted">
          The article you&apos;re looking for doesn&apos;t exist yet or has been moved.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent/90"
          >
            Go to Home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-lg border border-theme bg-panel px-6 py-3 font-medium text-body transition hover:bg-panel-soft"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
