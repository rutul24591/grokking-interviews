'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { UploadFile } from '../lib/upload-types';
import { formatFileSize, FILE_TYPE_ICONS, computeProgress } from '../lib/upload-types';
import { useUploadStore } from '../lib/upload-store';

interface FileListItemProps {
  file: UploadFile;
}

const statusBadgeClasses: Record<string, string> = {
  queued: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  uploading: 'bg-blue-200 text-blue-700 dark:bg-blue-800 dark:text-blue-200',
  paused: 'bg-yellow-200 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200',
  completed: 'bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-200',
  failed: 'bg-red-200 text-red-700 dark:bg-red-800 dark:text-red-200',
  cancelled: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const statusLabels: Record<string, string> = {
  queued: 'Queued',
  uploading: 'Uploading',
  paused: 'Paused',
  completed: 'Complete',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

function FilePreview({ file }: { file: UploadFile }) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file.file);
      setThumbnailUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file.file, file.type]);

  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt={`Preview of ${file.name}`}
        className="h-10 w-10 rounded object-cover"
      />
    );
  }

  // Non-image: show file type icon
  const label = FILE_TYPE_ICONS[file.type] || file.type.split('/')[1]?.toUpperCase() || 'FILE';

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
      {label.slice(0, 4)}
    </div>
  );
}

function SegmentedProgressBar({ chunks }: { chunks: UploadFile['chunks'] }) {
  const total = chunks.length;
  if (total === 0) return null;

  // Show max 50 segments for visual clarity
  const displayCount = Math.min(total, 50);

  return (
    <div className="mt-2 flex gap-px" aria-hidden="true">
      {Array.from({ length: displayCount }).map((_, i) => {
        // Map display index to actual chunk index
        const chunkIndex = Math.floor((i / displayCount) * total);
        const chunk = chunks[chunkIndex];
        const isComplete = chunk?.status === 'completed';
        const isUploading = chunk?.status === 'uploading';
        const isFailed = chunk?.status === 'failed';

        let bgClass = 'bg-gray-200 dark:bg-gray-700';
        if (isComplete) bgClass = 'bg-green-500 dark:bg-green-400';
        else if (isUploading) bgClass = 'bg-blue-500 dark:bg-blue-400';
        else if (isFailed) bgClass = 'bg-red-500 dark:bg-red-400';

        return (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-sm transition-colors ${bgClass}`}
          />
        );
      })}
    </div>
  );
}

export function FileListItem({ file }: FileListItemProps) {
  const cancelUpload = useUploadStore((state) => state.cancelUpload);
  const retryFile = useUploadStore((state) => state.retryFile);

  const progress = useMemo(() => computeProgress(file.chunks), [file.chunks]);

  const handleCancel = useCallback(() => {
    cancelUpload(file.id);
  }, [cancelUpload, file.id]);

  const handleRetry = useCallback(() => {
    retryFile(file.id);
  }, [retryFile, file.id]);

  const isActionable = file.status === 'uploading' || file.status === 'queued';
  const isRetryable = file.status === 'failed';

  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      role="listitem"
    >
      <div className="flex items-center gap-3">
        {/* Preview */}
        <FilePreview file={file} />

        {/* File info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(file.size)}
          </p>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusBadgeClasses[file.status] || statusBadgeClasses.queued
          }`}
        >
          {statusLabels[file.status] || file.status}
        </span>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {isActionable && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
              aria-label={`Cancel upload of ${file.name}`}
            >
              Cancel
            </button>
          )}
          {isRetryable && (
            <button
              type="button"
              onClick={handleRetry}
              className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
              aria-label={`Retry upload of ${file.name}`}
            >
              Retry
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {(file.status === 'uploading' || file.status === 'completed') && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{progress}%</span>
            <span aria-hidden="true">{formatFileSize(Math.round((progress / 100) * file.size))} / {formatFileSize(file.size)}</span>
          </div>
          <div
            className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${file.name} upload progress: ${progress}%`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                file.status === 'completed'
                  ? 'bg-green-500 dark:bg-green-400'
                  : 'bg-blue-500 dark:bg-blue-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Segmented chunk progress */}
          {file.chunks.length > 1 && <SegmentedProgressBar chunks={file.chunks} />}
        </div>
      )}

      {/* Error message */}
      {file.errorMessage && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400" role="alert">
          {file.errorMessage}
        </p>
      )}
    </div>
  );
}
