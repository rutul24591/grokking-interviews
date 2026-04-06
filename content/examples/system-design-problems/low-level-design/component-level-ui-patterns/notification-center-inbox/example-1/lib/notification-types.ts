export interface Notification { id: string; type: string; title: string; body: string; timestamp: number; read: boolean; groupingKey: string; actionUrl?: string; }
export interface GroupedNotification { key: string; count: number; notifications: Notification[]; sampleText: string; }
export interface NotificationState { notifications: Notification[]; unreadCount: number; filter: 'all' | 'unread' | string; }
