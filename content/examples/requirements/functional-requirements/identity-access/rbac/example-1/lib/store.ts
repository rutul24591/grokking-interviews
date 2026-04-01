export const grantMap = {
  "viewer:dashboard.read": true,
  "editor:content.edit": true,
  "admin:users.manage": true,
  "admin:content.publish": true
};

export const rbacState = {
  role: "editor",
  resource: "content",
  action: "content.edit",
  lastDecision: "No evaluation yet."
};
