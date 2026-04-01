export const permissionMap = {
  "admin:delete-report": true,
  "editor:delete-report": false,
  "editor:edit-draft": true,
  "viewer:view-draft": true,
  "admin:publish-report": true,
  "editor:publish-report": false
};

export const approvalOverrides = {
  "editor:publish-report:finance": "requires-approver"
};
