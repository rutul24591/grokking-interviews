# Notification Center / Inbox — Implementation Walkthrough

## Architecture

```
┌─────────────────────────────────────────┐
│ Notifications               [Mark all]  │
│ 🔴 12 unread                            │
├─────────────────────────────────────────┤
│ [All] [Mentions] [System] [Unread]      │
├─────────────────────────────────────────┤
│ 🔵 Alice commented on your post   2m    │
│    "Great work! I think we should..."    │
│ 🔵 Bob and 4 others liked your post 15m  │
│ ⚪ System: Your build succeeded    1h    │
│ ⚪ System: Deployment completed     3h   │
└─────────────────────────────────────────┘
```

## Key Design Decisions

1. **Normalized store** — Map-based notification lookup, unread count O(1)
2. **Grouping engine** — Collapses same-key notifications with count and sample text
3. **WebSocket real-time** — New notifications, read sync, badge count
4. **Virtualized list** — 1000+ notifications, only visible rendered
5. **Badge with doc title** — Updates document title prefix for background tab alerts

## File Structure

- `lib/notification-types.ts` — Notification, GroupedNotification types
- `lib/notification-store.ts` — Zustand store with unread count, filters, pagination
- `lib/grouping-engine.ts` — Groups by key, generates sample text
- `hooks/use-notifications.ts` — Main hook with WebSocket, lazy loading
- `components/notification-center.tsx` — Root panel with list, filters, mark-all-read
- `components/notification-item.tsx` — Individual notification with read/unread styling
- `components/notification-badge.tsx` — Unread count badge with document title
- `EXPLANATION.md`

## Performance

- addNotification: O(1) Map set
- Grouping: O(n) single pass, incremental O(1) for new notifications
- Virtualization: 20 visible items, 10-item overscan

## Testing

- Unit: store (add/mark read/mark all read), grouping engine, badge counter
- Integration: WebSocket delivery, mark-all-read, filter changes
- Accessibility: aria-live for new notifications, keyboard navigation
