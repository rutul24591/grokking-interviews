function evaluateNotificationPriority(cases) {
  return cases.map((entry) => ({
    notification: entry.notification,
    bucket: entry.securityImpact ? "critical" : entry.unreadCount > 20 ? "digest" : "normal",
    shouldGroup: entry.sourceCount > 1 && !entry.requiresAction,
    pinToTop: entry.requiresAction || entry.securityImpact
  }));
}

console.log(JSON.stringify(evaluateNotificationPriority([
  { notification: "security", securityImpact: true, unreadCount: 1, sourceCount: 1, requiresAction: true },
  { notification: "mentions", securityImpact: false, unreadCount: 8, sourceCount: 3, requiresAction: false },
  { notification: "marketing", securityImpact: false, unreadCount: 28, sourceCount: 9, requiresAction: false }
]), null, 2));
