function detectNotificationFallbacks(cases) {
  return cases.map((entry) => ({
    notification: entry.notification,
    rebuildUnreadCount: entry.sidebarUnread !== entry.feedUnread,
    redirectToArchive: entry.targetMissing && entry.hasAuditRecord,
    showSafeFallback: entry.targetMissing && !entry.hasAuditRecord
  }));
}

console.log(JSON.stringify(detectNotificationFallbacks([
  { notification: "mention", sidebarUnread: 3, feedUnread: 3, targetMissing: false, hasAuditRecord: false },
  { notification: "security", sidebarUnread: 5, feedUnread: 3, targetMissing: true, hasAuditRecord: true },
  { notification: "task", sidebarUnread: 1, feedUnread: 2, targetMissing: true, hasAuditRecord: false }
]), null, 2));
