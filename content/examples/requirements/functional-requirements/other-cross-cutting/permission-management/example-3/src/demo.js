function evaluatePermissionEdges(subjects) {
  return subjects.map((entry) => ({
    subjectId: entry.subjectId,
    revokeShadowGrant: entry.removedGroupStillCached,
    blockRoleDowngrade: entry.activeCriticalTask,
    rebuildAccessPreview: entry.permissionResolverMismatch
  }));
}

console.log(JSON.stringify(evaluatePermissionEdges([
  {
    "subjectId": "edge-1",
    "removedGroupStillCached": true,
    "activeCriticalTask": false,
    "permissionResolverMismatch": false
  },
  {
    "subjectId": "edge-2",
    "removedGroupStillCached": false,
    "activeCriticalTask": true,
    "permissionResolverMismatch": false
  },
  {
    "subjectId": "edge-3",
    "removedGroupStillCached": false,
    "activeCriticalTask": false,
    "permissionResolverMismatch": true
  }
]), null, 2));
