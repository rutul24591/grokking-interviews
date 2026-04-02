function detectReceiptEdgeCases(cases) {
  return cases.map((entry) => ({
    message: entry.message,
    ignoreLateRead: entry.readTimestamp < entry.deliveredTimestamp,
    keepPrivacyPlaceholder: entry.receiptsDisabled && entry.readEventArrived,
    rebuildTimeline: entry.deliveryMissing && entry.readEventArrived
  }));
}

console.log(JSON.stringify(detectReceiptEdgeCases([
  { message: "m1", readTimestamp: 20, deliveredTimestamp: 10, receiptsDisabled: false, readEventArrived: true, deliveryMissing: false },
  { message: "m2", readTimestamp: 5, deliveredTimestamp: 10, receiptsDisabled: false, readEventArrived: true, deliveryMissing: true },
  { message: "m3", readTimestamp: 30, deliveredTimestamp: 20, receiptsDisabled: true, readEventArrived: true, deliveryMissing: false }
]), null, 2));
