function validateAuditBatch(entries) {
  return entries.map((entry) => {
    const missing = ["actor", "action", "target", "timestamp", "requestId"].filter((field) => !entry[field]);
    return {
      id: entry.id,
      valid: missing.length === 0,
      missing,
      redactBeforeExport: entry.containsSecret === true
    };
  });
}

console.log(
  validateAuditBatch([
    { id: "a1", actor: "admin-21", action: "suspend-account", target: "user-449", requestId: "req-19" },
    { id: "a2", actor: "admin-9", action: "export-log", target: "case-7", timestamp: "2026-04-02T09:14:00Z", containsSecret: true }
  ])
);
