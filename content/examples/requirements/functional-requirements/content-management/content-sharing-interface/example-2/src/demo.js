function shareEligibility(channel) {
  return {
    allowed: channel.status !== "rate-limited" && channel.previewReady,
    fallback: channel.status === "rate-limited" ? "copy-link" : !channel.previewReady ? "queue-preview-regeneration" : null,
    auditRequired: channel.isExternal && channel.audienceSize > 10000
  };
}

console.log(shareEligibility({ status: "rate-limited", previewReady: true, isExternal: true, audienceSize: 22000 }));
