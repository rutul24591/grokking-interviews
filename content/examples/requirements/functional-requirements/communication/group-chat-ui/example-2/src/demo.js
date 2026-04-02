function evaluateGroupPermissions(cases) {
  return cases.map((entry) => ({
    room: entry.room,
    canPost: entry.isMember && !entry.readOnly && !entry.removed,
    canInvite: entry.role === "owner" || entry.role === "moderator",
    needsModeratorBanner: entry.removed || entry.pendingApproval
  }));
}

console.log(JSON.stringify(evaluateGroupPermissions([
  { room: "community", isMember: true, readOnly: false, removed: false, role: "member", pendingApproval: false },
  { room: "incident", isMember: true, readOnly: true, removed: false, role: "moderator", pendingApproval: false },
  { room: "archive", isMember: false, readOnly: true, removed: true, role: "member", pendingApproval: true }
]), null, 2));
