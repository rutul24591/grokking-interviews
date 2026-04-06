// ============================================================
// image-placeholder.tsx — Inline image upload progress
// indicator with completion state, error state, and retry
// button.
// ============================================================

"use client";

import React from "react";
import type { ImageData } from "../lib/editor-types";

interface ImagePlaceholderProps {
  image: ImageData;
  onRetry?: (imageId: string) => void;
  onRemove?: (imageId: string) => void;
  className?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  image,
  onRetry,
  onRemove,
  className = "",
}) => {
  // ── Upload Complete: Render the actual image ──────────────

  if (image.status === "complete" && image.url) {
    return (
      <figure className={`my-4 rounded-lg border border-theme overflow-hidden ${className}`}>
        <img
          src={image.url}
          alt=""
          className="w-full object-contain"
          loading="lazy"
        />
      </figure>
    );
  }

  // ── Upload Failed: Render error with retry ────────────────

  if (image.status === "failed") {
    return (
      <div
        className={`my-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          {/* Error Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 text-red-500"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 8v4M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Upload failed
            </p>
            <p className="text-xs text-muted truncate">
              {image.error ?? "Unknown error"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={() => onRetry(image.id)}
              className="rounded-md bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/30 dark:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              Retry
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(image.id)}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-panel transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Uploading / Pending: Render progress bar ──────────────

  const progress = image.progress ?? 0;

  return (
    <div
      className={`my-4 rounded-lg border border-theme bg-panel-soft p-6 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`Image upload progress: ${progress}%`}
    >
      <div className="flex items-center gap-3">
        {/* Upload Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 ${
            image.status === "uploading"
              ? "text-accent animate-pulse"
              : "text-muted"
          }`}
          aria-hidden="true"
        >
          <path
            d="M12 16V4M12 4l-4 4M12 4l4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {image.status === "uploading"
              ? "Uploading image..."
              : "Preparing upload..."}
          </p>

          {/* Progress Bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-panel">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <p className="mt-1 text-xs text-muted">{progress}% complete</p>
        </div>
      </div>
    </div>
  );
};

export default ImagePlaceholder;
