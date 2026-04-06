'use client';
import { useCallback, useState, useMemo } from 'react';
import type { Notification } from '../lib/notification-types';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onActionClick?: (url: string, notification: Notification) => void;
  className?: string;
  showActions?: boolean;
  groupingCount?: number;
}

/**
 * Individual notification item component with grouping display,
 * action link, and mark-as-read functionality.
 */
export function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
  onActionClick,
  className = '',
  showActions = true,
  groupingCount,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMarkRead = useCallback(() => {
    if (!notification.read) {
      onMarkRead(notification.id);
    }
  }, [notification, onMarkRead]);

  const handleDismiss = useCallback(() => {
    onDismiss(notification.id);
  }, [notification.id, onDismiss]);

  const handleActionClick = useCallback(() => {
    if (notification.actionUrl) {
      onActionClick?.(notification.actionUrl, notification);
      handleMarkRead();
    }
  }, [notification, onActionClick, handleMarkRead]);

  const timeAgo = useMemo(() => {
    const diff = Date.now() - notification.timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }, [notification.timestamp]);

  // Type icon mapping
  const typeIcon = useMemo(() => {
    const icons: Record<string, string> = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
      mention: '@',
      system: '⚙️',
    };
    return icons[notification.type] ?? '🔔';
  }, [notification.type]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 transition-colors ${
        notification.read
          ? 'bg-white dark:bg-gray-900'
          : 'bg-blue-50/50 dark:bg-blue-900/10'
      } hover:bg-gray-50 dark:hover:bg-gray-800/50 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`Notification: ${notification.title}`}
    >
      {/* Type icon */}
      <div className="flex-shrink-0 mt-0.5 text-lg" aria-hidden="true">
        {typeIcon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`text-sm truncate ${
              notification.read
                ? 'text-gray-700 dark:text-gray-300 font-normal'
                : 'text-gray-900 dark:text-gray-100 font-semibold'
            }`}
          >
            {notification.title}
          </h4>
          {/* Unread indicator */}
          {!notification.read && (
            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-blue-500 rounded-full" />
          )}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
          {notification.body}
        </p>

        {/* Grouping count */}
        {groupingCount && groupingCount > 1 && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            +{groupingCount - 1} more similar notification{groupingCount > 2 ? 's' : ''}
          </p>
        )}

        {/* Timestamp and actions */}
        <div className="flex items-center gap-3 mt-1">
          <time className="text-xs text-gray-400 dark:text-gray-500">{timeAgo}</time>

          {showActions && isHovered && (
            <div className="flex items-center gap-2">
              {!notification.read && (
                <button
                  onClick={handleMarkRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mark as read
                </button>
              )}
              {notification.actionUrl && (
                <button
                  onClick={handleActionClick}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View details
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                aria-label="Dismiss notification"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
