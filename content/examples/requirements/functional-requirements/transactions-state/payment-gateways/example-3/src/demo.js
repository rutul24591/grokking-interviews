function detectGatewayEdgeCases(payments) {
  const duplicateCapture = payments.filter((payment) => payment.sameAuthorizationCapturedTwice).map((payment) => payment.id);
  const timedOut = payments.filter((payment) => payment.gatewayStatus === "timeout").map((payment) => payment.id);
  return {
    duplicateCapture,
    timedOut,
    suppressRetry: duplicateCapture.length > 0,
    routeToBackup: timedOut.length > 0
  };
}

console.log(detectGatewayEdgeCases([
  { id: "pay-1", sameAuthorizationCapturedTwice: true, gatewayStatus: "captured" },
  { id: "pay-2", sameAuthorizationCapturedTwice: false, gatewayStatus: "timeout" }
]));
