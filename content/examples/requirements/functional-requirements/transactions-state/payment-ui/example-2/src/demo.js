function choosePaymentUIView(cases) {
  const views = cases.map((entry) => ({
    id: entry.id,
    view: !entry.methodReady ? "entry" : entry.processorState === "processing" ? "processing" : entry.processorState === "failed" ? "failed" : "confirmed",
    disableCTA: entry.processorState === "processing",
    showRecoveryCopy: entry.processorState === "failed",
    inlineMessage:
      !entry.methodReady ? "collect-payment-method" :
      entry.processorState === "processing" ? "await-processor" :
      entry.processorState === "failed" ? "recover-payment" : "show-success"
  }));

  return {
    views,
    summary: {
      disabled: views.filter((entry) => entry.disableCTA).length,
      recovery: views.filter((entry) => entry.showRecoveryCopy).length
    }
  };
}

console.log(JSON.stringify(choosePaymentUIView([
  { id: "ui-1", methodReady: false, processorState: "idle" },
  { id: "ui-2", methodReady: true, processorState: "failed" },
  { id: "ui-3", methodReady: true, processorState: "processing" }
]), null, 2));
