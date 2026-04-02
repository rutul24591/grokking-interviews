function evaluateConsentEdges(records) {
  return records.map((entry) => ({
    recordId: entry.recordId,
    invalidateCachedBanner: entry.policyTextChanged,
    freezePartnerSync: entry.partnerConsentRevoked,
    rebuildAuditTrail: entry.missingDeviceProvenance || entry.duplicateWriteDetected
  }));
}

console.log(JSON.stringify(evaluateConsentEdges([
  {
    "recordId": "edge-1",
    "policyTextChanged": true,
    "partnerConsentRevoked": false,
    "missingDeviceProvenance": false,
    "duplicateWriteDetected": false
  },
  {
    "recordId": "edge-2",
    "policyTextChanged": false,
    "partnerConsentRevoked": true,
    "missingDeviceProvenance": false,
    "duplicateWriteDetected": false
  },
  {
    "recordId": "edge-3",
    "policyTextChanged": false,
    "partnerConsentRevoked": false,
    "missingDeviceProvenance": true,
    "duplicateWriteDetected": true
  }
]), null, 2));
