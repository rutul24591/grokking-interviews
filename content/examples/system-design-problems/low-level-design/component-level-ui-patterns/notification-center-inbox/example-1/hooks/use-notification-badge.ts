'use client';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

interface UseNotificationBadgeOptions {
  unreadCount: number;
  maxDisplay?: number;
  updateDocumentTitle?: boolean;
  titlePrefix?: string;
  variant?: 'dot' | 'count' | 'pill';
}

interface UseNotificationBadgeReturn {
  displayCount: number | string;
  shouldShow: boolean;
  variant: 'dot' | 'count' | 'pill';
  ariaLabel: string;
  formattedCount: string;
}

/**
 * Hook for notification badge state management.
 * Computes display count (with overflow), document title prefix,
 * and provides formatted values for badge rendering.
 */
export function useNotificationBadge({
  unreadCount,
  maxDisplay = 99,
  updateDocumentTitle = true,
  titlePrefix,
  variant = 'count',
}: UseNotificationBadgeOptions): UseNotificationBadgeReturn {
  const originalTitleRef = useRef<string | null>(null);

  const displayCount = unreadCount > maxDisplay ? `${maxDisplay}+` : unreadCount;
  const formattedCount = unreadCount > maxDisplay ? `${maxDisplay}+` : String(unreadCount);
  const shouldShow = variant === 'dot' ? unreadCount > 0 : unreadCount > 0;

  const ariaLabel = useMemo(() => {
    if (variant === 'dot') {
      return unreadCount > 0 ? 'You have unread notifications' : '';
    }
    return `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`;
  }, [variant, unreadCount]);

  // Update document title with unread count prefix
  useEffect(() => {
    if (!updateDocumentTitle) return;

    if (originalTitleRef.current === null) {
      originalTitleRef.current = document.title;
    }

    if (unreadCount > 0) {
      const prefix = titlePrefix ?? `(${unreadCount > maxDisplay ? `${maxDisplay}+` : unreadCount})`;
      const baseTitle = originalTitleRef.current ?? document.title;
      // Avoid double-prefixing
      if (!baseTitle.startsWith(prefix)) {
        document.title = `${prefix} ${baseTitle}`;
      }
    } else if (originalTitleRef.current !== null) {
      document.title = originalTitleRef.current;
    }

    return () => {
      if (originalTitleRef.current !== null) {
        document.title = originalTitleRef.current;
      }
    };
  }, [unreadCount, maxDisplay, updateDocumentTitle, titlePrefix]);

  return {
    displayCount,
    shouldShow,
    variant,
    ariaLabel,
    formattedCount,
  };
}
