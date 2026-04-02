function detectNotificationDeliveryFailures(cases) {
  return cases.map((entry) => ({
    notification: entry.notification,
    stopRetryStorm: entry.retryCount > entry.retryBudget,
    switchChannel: entry.providerOutage || entry.channelRejected,
    rebuildPreferenceSnapshot: entry.preferenceVersionMismatch
  }));
}

console.log(JSON.stringify(detectNotificationDeliveryFailures([
  { notification: "payment", retryCount: 1, retryBudget: 3, providerOutage: false, channelRejected: false, preferenceVersionMismatch: false },
  { notification: "digest", retryCount: 6, retryBudget: 2, providerOutage: true, channelRejected: false, preferenceVersionMismatch: true },
  { notification: "otp", retryCount: 3, retryBudget: 3, providerOutage: false, channelRejected: true, preferenceVersionMismatch: false }
]), null, 2));
