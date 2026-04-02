function detectPaymentUIEdgeCases(cases) {
  const analysis = cases.map((entry) => ({
    id: entry.id,
    stuckProcessing: entry.processingMinutes > entry.maxProcessingMinutes,
    lostConfirmation: entry.processorConfirmed && !entry.uiConfirmed,
    methodSwappedMidFlight: entry.methodChangedAfterSubmit,
    action:
      entry.processingMinutes > entry.maxProcessingMinutes ? "show-fallback-support" :
      entry.processorConfirmed && !entry.uiConfirmed ? "refresh-confirmation-state" :
      entry.methodChangedAfterSubmit ? "invalidate-client-session" : "continue"
  }));

  return {
    analysis,
    showFallbackSupport: analysis.some((entry) => entry.stuckProcessing),
    invalidateClientSession: analysis.some((entry) => entry.methodSwappedMidFlight)
  };
}

console.log(JSON.stringify(detectPaymentUIEdgeCases([
  { id: "ui-1", processingMinutes: 12, maxProcessingMinutes: 5, processorConfirmed: false, uiConfirmed: false, methodChangedAfterSubmit: false },
  { id: "ui-2", processingMinutes: 1, maxProcessingMinutes: 5, processorConfirmed: true, uiConfirmed: false, methodChangedAfterSubmit: false },
  { id: "ui-3", processingMinutes: 2, maxProcessingMinutes: 5, processorConfirmed: false, uiConfirmed: false, methodChangedAfterSubmit: true }
]), null, 2));
