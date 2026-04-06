"use client";

import type { ValidationError } from "../../lib/validation-types";

interface ValidationErrorProps {
  error: ValidationError;
  message?: string;
  fieldName?: string;
  className?: string;
}

/**
 * Inline error message displayed below a form field.
 * Uses aria-live="polite" for screen reader announcements.
 */
export function ValidationError({
  error,
  message,
  fieldName,
  className = "",
}: ValidationErrorProps) {
  const errorId = fieldName ? `${fieldName}-error` : undefined;
  const displayMessage = message || error.messageKey;

  return (
    <div
      id={errorId}
      role="alert"
      aria-live="polite"
      className={`mt-1 flex items-start gap-1.5 text-sm text-red-600 dark:text-red-400 ${className}`}
    >
      <svg
        className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      <span>{displayMessage}</span>
    </div>
  );
}

/**
 * Inline error list for a single field (multiple errors).
 */
export function ValidationErrorList({
  errors,
  messages,
  fieldName,
  className = "",
}: {
  errors: ValidationError[];
  messages?: string[];
  fieldName?: string;
  className?: string;
}) {
  if (errors.length === 0) return null;

  return (
    <div
      className={`mt-1 space-y-1 ${className}`}
      aria-live="polite"
    >
      {errors.map((error, index) => (
        <ValidationError
          key={`${error.code}-${index}`}
          error={error}
          message={messages?.[index]}
          fieldName={fieldName}
        />
      ))}
    </div>
  );
}
