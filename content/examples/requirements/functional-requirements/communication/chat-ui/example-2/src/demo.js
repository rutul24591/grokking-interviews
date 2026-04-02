function evaluateChatComposer(cases) {
  return cases.map((entry) => ({
    thread: entry.thread,
    canSend: entry.hasDraft && entry.transportHealthy && !entry.blockedByPolicy,
    needsAttachmentFallback: entry.hasAttachment && !entry.attachmentReady,
    shouldEscalate: entry.retryCount > 2 || entry.vipCustomer
  }));
}

console.log(JSON.stringify(evaluateChatComposer([
  { thread: "customer reset", hasDraft: true, transportHealthy: true, blockedByPolicy: false, hasAttachment: false, attachmentReady: true, retryCount: 0, vipCustomer: false },
  { thread: "vip escalation", hasDraft: true, transportHealthy: false, blockedByPolicy: false, hasAttachment: true, attachmentReady: false, retryCount: 3, vipCustomer: true },
  { thread: "restricted room", hasDraft: true, transportHealthy: true, blockedByPolicy: true, hasAttachment: false, attachmentReady: true, retryCount: 0, vipCustomer: false }
]), null, 2));
