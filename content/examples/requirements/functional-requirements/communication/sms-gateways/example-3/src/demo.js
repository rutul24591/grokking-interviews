function detectSmsFailures(cases) {
  return cases.map((entry) => ({
    message: entry.message,
    switchCarrier: entry.carrierRejected || entry.primaryCarrierDown,
    stopDuplicateOtp: entry.sameRequestId && entry.samePhone,
    escalateToVoiceFallback: entry.failureCount >= 3 && entry.urgent
  }));
}

console.log(JSON.stringify(detectSmsFailures([
  { message: "otp", carrierRejected: false, primaryCarrierDown: false, sameRequestId: false, samePhone: false, failureCount: 0, urgent: true },
  { message: "alert", carrierRejected: true, primaryCarrierDown: false, sameRequestId: true, samePhone: true, failureCount: 2, urgent: true },
  { message: "receipt", carrierRejected: false, primaryCarrierDown: true, sameRequestId: false, samePhone: false, failureCount: 4, urgent: false }
]), null, 2));
