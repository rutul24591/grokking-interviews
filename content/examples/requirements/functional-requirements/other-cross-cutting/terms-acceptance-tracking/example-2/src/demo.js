function evaluateTermsAcceptance(events) {
  return events.map((entry) => ({
    eventId: entry.eventId,
    grantAccess: entry.acceptedCurrentVersion && !entry.regionHardGate,
    showReminderOnly: !entry.acceptedCurrentVersion && entry.graceWindowOpen,
    requireFreshPrompt: entry.policyHashChanged || entry.acceptanceMissingMetadata
  }));
}

console.log(JSON.stringify(evaluateTermsAcceptance([
  {
    "eventId": "ta-1",
    "acceptedCurrentVersion": true,
    "regionHardGate": false,
    "graceWindowOpen": false,
    "policyHashChanged": false,
    "acceptanceMissingMetadata": false
  },
  {
    "eventId": "ta-2",
    "acceptedCurrentVersion": false,
    "regionHardGate": false,
    "graceWindowOpen": true,
    "policyHashChanged": false,
    "acceptanceMissingMetadata": false
  },
  {
    "eventId": "ta-3",
    "acceptedCurrentVersion": false,
    "regionHardGate": true,
    "graceWindowOpen": false,
    "policyHashChanged": true,
    "acceptanceMissingMetadata": true
  }
]), null, 2));
