'use client';

import { useCallback, useRef, useState } from 'react';
import { useUploadStore } from '../lib/upload-store';

interface DropZoneProps {
  onFilesAdded?: (files: FileList) => void;
}

export function DropZone({ onFilesAdded }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFiles = useUploadStore((state) => state.addFiles);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      setDragError(null);

      const items = e.dataTransfer.items;
      const files: File[] = [];

      if (items) {
        // Handle DataTransferItemList
        for (let i = 0; i < items.length; i++) {
          const entry = items[i].webkitGetAsEntry?.();

          if (entry?.isFile) {
            const file = items[i].getAsFile();
            if (file) files.push(file);
          } else if (entry?.isDirectory) {
            setDragError('Folders are not supported. Please drop individual files.');
            return;
          }
        }
      } else {
        // Fallback to DataTransfer.files
        const droppedFiles = e.dataTransfer.files;
        for (let i = 0; i < droppedFiles.length; i++) {
          files.push(droppedFiles[i]);
        }
      }

      if (files.length === 0 && !dragError) {
        setDragError('No valid files found.');
        return;
      }

      if (files.length > 0) {
        // Convert File[] to FileList-like object
        const dataTransfer = new DataTransfer();
        files.forEach((f) => dataTransfer.items.add(f));
        addFiles(dataTransfer.files);
        onFilesAdded?.(dataTransfer.files);
      }
    },
    [addFiles, onFilesAdded, dragError]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        addFiles(files);
        onFilesAdded?.(files);
        // Reset input so the same file can be selected again
        e.target.value = '';
      }
    },
    [addFiles, onFilesAdded]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Drop files here or click to browse"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8
        transition-colors duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-gray-500'
        }
      `}
    >
      {/* Upload icon */}
      <svg
        className={`mb-4 h-12 w-12 transition-colors ${
          isDragOver
            ? 'text-blue-500 dark:text-blue-400'
            : 'text-gray-400 dark:text-gray-500'
        }`}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M24 32V16M24 16l-8 8M24 16l8 8" />
        <path d="M8 32h32a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v16a4 4 0 0 0 4 4z" />
      </svg>

      <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
        {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
      </p>
      <p className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
        or click to browse
      </p>

      {dragError && (
        <p className="mt-3 text-center text-sm font-medium text-red-600 dark:text-red-400" role="alert">
          {dragError}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
        aria-hidden="true"
      />
    </div>
  );
}
