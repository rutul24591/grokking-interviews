function detectPrivilegeDrift(accounts) {
  const drifted = accounts
    .filter((account) => account.expectedRole !== account.actualRole || account.lastRotationDays > account.maxRotationDays)
    .map((account) => account.id);
  return {
    drifted,
    freezeWrites: drifted.length > 0,
    requireKeyRotation: accounts.filter((account) => account.lastRotationDays > account.maxRotationDays).map((account) => account.id)
  };
}

console.log(
  detectPrivilegeDrift([
    { id: "svc-17", expectedRole: "user-admin", actualRole: "user-admin", lastRotationDays: 21, maxRotationDays: 30 },
    { id: "svc-22", expectedRole: "suspension-admin", actualRole: "super-admin", lastRotationDays: 61, maxRotationDays: 30 }
  ])
);
