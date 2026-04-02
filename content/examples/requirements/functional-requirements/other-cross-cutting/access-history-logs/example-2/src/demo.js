function evaluateAccessHistoryLogs(events) {
  return events.map((entry) => ({
    eventId: entry.eventId,
    showToUser: entry.userVisible && !entry.securityOnly,
    flagForReview: !entry.justificationComplete || entry.offHoursAccess,
    expandSecurityContext: entry.repeatedSensitiveTableAccess || entry.sourceIpMismatch
  }));
}

console.log(JSON.stringify(evaluateAccessHistoryLogs([
  {
    "eventId": "al-1",
    "userVisible": true,
    "securityOnly": false,
    "justificationComplete": true,
    "offHoursAccess": false,
    "repeatedSensitiveTableAccess": false,
    "sourceIpMismatch": false
  },
  {
    "eventId": "al-2",
    "userVisible": true,
    "securityOnly": false,
    "justificationComplete": false,
    "offHoursAccess": true,
    "repeatedSensitiveTableAccess": true,
    "sourceIpMismatch": false
  },
  {
    "eventId": "al-3",
    "userVisible": false,
    "securityOnly": true,
    "justificationComplete": true,
    "offHoursAccess": false,
    "repeatedSensitiveTableAccess": false,
    "sourceIpMismatch": true
  }
]), null, 2));
