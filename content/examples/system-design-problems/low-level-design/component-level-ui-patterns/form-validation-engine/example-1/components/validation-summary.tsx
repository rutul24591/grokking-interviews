"use client";

import type { FormattedError } from "../../lib/error-formatter";

interface ValidationSummaryProps {
  errors: FormattedError[];
  title?: string;
  className?: string;
}

/**
 * Validation summary displayed at the top of the form.
 * Lists all errors with anchor links to the corresponding fields.
 * Uses role="alert" for immediate screen reader announcement.
 */
export function ValidationSummary({
  errors,
  title = "Please fix the following errors:",
  className = "",
}: ValidationSummaryProps) {
  if (errors.length === 0) return null;

  function scrollToField(fieldName: string) {
    const element = document.getElementById(fieldName);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30 ${className}`}
    >
      <div className="flex items-start gap-2">
        <svg
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
            {title}
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {errors.map((error, index) => (
              <li key={`${error.anchorId}-${index}`}>
                <button
                  type="button"
                  className="text-red-700 underline hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                  onClick={() => scrollToField(error.fieldName)}
                >
                  {error.message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
