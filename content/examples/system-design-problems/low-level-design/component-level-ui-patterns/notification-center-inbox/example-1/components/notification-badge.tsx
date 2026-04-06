'use client';
import { useEffect, useRef } from 'react';

interface NotificationBadgeProps {
  count: number;
  maxDisplay?: number;
  className?: string;
  variant?: 'dot' | 'count' | 'pill';
  updateDocumentTitle?: boolean;
  titlePrefix?: string;
}

export function NotificationBadge({
  count,
  maxDisplay = 99,
  className = '',
  variant = 'count',
  updateDocumentTitle = true,
  titlePrefix = '',
}: NotificationBadgeProps) {
  const originalTitleRef = useRef<string | null>(null);

  // Update document title with unread count
  useEffect(() => {
    if (!updateDocumentTitle) return;

    if (originalTitleRef.current === null) {
      originalTitleRef.current = document.title;
    }

    if (count > 0) {
      const prefix = titlePrefix || `(${count > maxDisplay ? `${maxDisplay}+` : count})`;
      const currentTitle = originalTitleRef.current || document.title;
      // Only update if not already prefixed
      if (!currentTitle.startsWith(prefix)) {
        document.title = `${prefix} ${currentTitle}`;
      }
    } else {
      // Restore original title
      if (originalTitleRef.current !== null) {
        document.title = originalTitleRef.current;
      }
    }

    return () => {
      if (originalTitleRef.current !== null) {
        document.title = originalTitleRef.current;
      }
    };
  }, [count, maxDisplay, updateDocumentTitle, titlePrefix]);

  if (count <= 0 && variant !== 'dot') return null;

  if (variant === 'dot') {
    return (
      <span
        className={`inline-block w-2.5 h-2.5 bg-red-500 rounded-full ${count > 0 ? 'animate-pulse' : ''} ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'pill') {
    return (
      <span
        className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full ${className}`}
        aria-label={`${count} unread notification${count !== 1 ? 's' : ''}`}
      >
        {count > maxDisplay ? `${maxDisplay}+` : count}
      </span>
    );
  }

  // Default: count
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-semibold text-white bg-red-500 rounded-full ${className}`}
      aria-label={`${count} unread notification${count !== 1 ? 's' : ''}`}
    >
      {count > maxDisplay ? `${maxDisplay}+` : count}
    </span>
  );
}

// Hook for document title management only
export function useDocumentTitleBadge(count: number, prefix?: string) {
  const originalTitleRef = useRef<string | null>(null);

  useEffect(() => {
    if (originalTitleRef.current === null) {
      originalTitleRef.current = document.title;
    }

    if (count > 0) {
      const p = prefix || `(${count})`;
      const base = originalTitleRef.current || document.title;
      document.title = `${p} ${base}`;
    } else if (originalTitleRef.current !== null) {
      document.title = originalTitleRef.current;
    }

    return () => {
      if (originalTitleRef.current !== null) {
        document.title = originalTitleRef.current;
      }
    };
  }, [count, prefix]);
}
