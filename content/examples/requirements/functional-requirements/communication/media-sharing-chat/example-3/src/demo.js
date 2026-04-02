function detectMediaFailures(cases) {
  return cases.map((entry) => ({
    asset: entry.asset,
    keepPlaceholderBubble: entry.uploadComplete && entry.derivativeFailed,
    offerDownloadFallback: entry.originalStored && entry.previewMissing,
    dropFromQueue: entry.uploadExpired || entry.policyRejected
  }));
}

console.log(JSON.stringify(detectMediaFailures([
  { asset: "photo", uploadComplete: true, derivativeFailed: false, originalStored: true, previewMissing: false, uploadExpired: false, policyRejected: false },
  { asset: "video", uploadComplete: true, derivativeFailed: true, originalStored: true, previewMissing: true, uploadExpired: false, policyRejected: false },
  { asset: "archive", uploadComplete: false, derivativeFailed: false, originalStored: false, previewMissing: true, uploadExpired: true, policyRejected: true }
]), null, 2));
