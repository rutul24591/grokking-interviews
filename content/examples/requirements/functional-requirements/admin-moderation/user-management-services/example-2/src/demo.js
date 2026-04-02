function evaluateProvisioningAction(events) {
  return events.map((event) => ({
    id: event.id,
    action:
      event.source === "hr-sync" && event.roleChange === "termination"
        ? "disable-account"
        : event.accountAgeDays > 180 && event.lastLoginDays > 120
          ? "review-dormant"
          : "apply-update",
    requireHumanApproval: event.affectsPrivilegedRole
  }));
}

console.log(
  evaluateProvisioningAction([
    { id: "e1", source: "hr-sync", roleChange: "termination", accountAgeDays: 90, lastLoginDays: 2, affectsPrivilegedRole: true },
    { id: "e2", source: "crm", roleChange: "profile-update", accountAgeDays: 200, lastLoginDays: 180, affectsPrivilegedRole: false }
  ])
);
