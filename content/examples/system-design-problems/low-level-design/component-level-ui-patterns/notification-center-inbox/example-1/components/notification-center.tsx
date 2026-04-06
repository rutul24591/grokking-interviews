'use client';
import { useState, useCallback, useMemo } from 'react';
import type { Notification, GroupedNotification } from './lib/notification-types';

export function NotificationCenter({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const grouped = useMemo(() => {
    const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
    const groups: Record<string, GroupedNotification> = {};
    for (const n of filtered) {
      if (!groups[n.groupingKey]) groups[n.groupingKey] = { key: n.groupingKey, count: 0, notifications: [], sampleText: '' };
      groups[n.groupingKey].count++;
      groups[n.groupingKey].notifications.push(n);
      if (groups[n.groupingKey].notifications.length === 1) groups[n.groupingKey].sampleText = n.title;
    }
    return Object.values(groups).sort((a, b) => b.notifications[0].timestamp - a.notifications[0].timestamp);
  }, [notifications, filter]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">Notifications {unreadCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}</h2>
        <button onClick={markAllRead} className="text-sm text-blue-500 hover:underline">Mark all read</button>
      </div>

      <div className="flex gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}>All</button>
        <button onClick={() => setFilter('unread')} className={`px-3 py-1 text-sm rounded ${filter === 'unread' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}>Unread</button>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        {grouped.map((group) => (
          <div key={group.key} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {group.count > 1 ? `${group.sampleText} +${group.count - 1} more` : group.sampleText}
            </p>
            <p className="text-xs text-gray-500 mt-1">{new Date(group.notifications[0].timestamp).toLocaleString()}</p>
            {group.notifications.filter((n) => !n.read).map((n) => (
              <button key={n.id} onClick={() => markAsRead(n.id)} className="text-xs text-blue-500 hover:underline mt-1">Mark read</button>
            ))}
          </div>
        ))}
        {grouped.length === 0 && <p className="p-8 text-center text-gray-500 dark:text-gray-400">No notifications</p>}
      </div>
    </div>
  );
}
