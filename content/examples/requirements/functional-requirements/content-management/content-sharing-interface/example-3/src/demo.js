function shareFallback(context) {
  if (context.channel === "social" && context.previewMissing) {
    return { action: "defer-share", reason: "missing-preview-card", queueRepair: true };
  }
  if (context.channel === "email" && context.audienceTooLarge) {
    return { action: "route-to-newsletter-workflow", reason: "audience-threshold", queueRepair: false };
  }
  if (context.channel === "partner-api" && context.partnerDown) {
    return { action: "queue-retry", reason: "partner-unavailable", queueRepair: false };
  }
  return { action: "share-now", reason: "ready", queueRepair: false };
}

console.log(shareFallback({ channel: "partner-api", previewMissing: false, audienceTooLarge: false, partnerDown: true }));
