"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type { FileItem } from "../lib/explorer-types";
import { generateThumbnailUrl, getFileIcon, detectFileType, getFileExtension } from "../lib/file-utils";

interface FileThumbnailProps {
  file: FileItem;
  size?: "small" | "medium" | "large";
  className?: string;
}

export function FileThumbnail({
  file,
  size = "medium",
  className = "",
}: FileThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const isImage = file.category === "image";
  const thumbnailUrl = isImage
    ? generateThumbnailUrl(file, size)
    : undefined;

  // Lazy loading via IntersectionObserver
  useEffect(() => {
    const element = imgRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  // Ensure category is set
  const category = file.category ?? detectFileType(getFileExtension(file.name));
  const iconPath = getFileIcon(category);

  const sizeClasses: Record<string, string> = {
    small: "w-8 h-8",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const iconSizeClasses: Record<string, string> = {
    small: "w-5 h-5",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div
      ref={imgRef}
      className={`${sizeClasses[size]} relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}
    >
      {/* Loading skeleton */}
      {isLoading && isInView && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      )}

      {/* Image thumbnail (only for image files) */}
      {isImage && thumbnailUrl && isInView && !hasError && (
        <Image
          src={thumbnailUrl}
          alt={file.name}
          fill
          className="object-cover"
          sizes={size === "small" ? "32px" : size === "medium" ? "128px" : "192px"}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* File type icon fallback */}
      {(!isImage || hasError || !isInView) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className={`${iconSizeClasses[size]} text-gray-400 dark:text-gray-500`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d={iconPath} />
          </svg>
        </div>
      )}
    </div>
  );
}
