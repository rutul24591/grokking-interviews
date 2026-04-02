function evaluateReceiptEligibility(cases) {
  return cases.map((entry) => ({
    message: entry.message,
    canEmitRead: entry.threadType === "direct" && entry.receiptsEnabled,
    shouldShowDelivered: entry.deliveryAcked,
    needsPartialGroupLabel: entry.threadType === "group" && entry.readCount < entry.memberCount
  }));
}

console.log(JSON.stringify(evaluateReceiptEligibility([
  { message: "m1", threadType: "direct", receiptsEnabled: true, deliveryAcked: true, readCount: 1, memberCount: 2 },
  { message: "m2", threadType: "group", receiptsEnabled: true, deliveryAcked: true, readCount: 3, memberCount: 6 },
  { message: "m3", threadType: "direct", receiptsEnabled: false, deliveryAcked: false, readCount: 0, memberCount: 2 }
]), null, 2));
