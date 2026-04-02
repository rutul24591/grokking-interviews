function detectProcessingEdgeCases(payments) {
  const duplicateCapture = payments.filter((payment) => payment.captureCount > 1).map((payment) => payment.id);
  const failedAfterAuth = payments.filter((payment) => payment.authorized && payment.exception !== "none").map((payment) => payment.id);
  return {
    duplicateCapture,
    failedAfterAuth,
    suppressCaptureRetry: duplicateCapture.length > 0,
    triggerCompensation: failedAfterAuth.length > 0
  };
}

console.log(detectProcessingEdgeCases([
  { id: "txn-1", captureCount: 2, authorized: true, exception: "none" },
  { id: "txn-2", captureCount: 1, authorized: true, exception: "issuer-decline" }
]));
