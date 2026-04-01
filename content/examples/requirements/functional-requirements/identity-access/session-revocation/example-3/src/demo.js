function revokeAllRequired({ passwordChanged, adminForcedLogout, compromiseDetected }) {
  return passwordChanged || adminForcedLogout || compromiseDetected;
}

console.log(revokeAllRequired({ passwordChanged: false, adminForcedLogout: false, compromiseDetected: false }));
console.log(revokeAllRequired({ passwordChanged: true, adminForcedLogout: false, compromiseDetected: false }));
