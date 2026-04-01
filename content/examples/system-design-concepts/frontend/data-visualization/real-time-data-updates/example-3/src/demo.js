function streamFallback(stream) {
  if (stream.lagMs > 5000) {
    return { action: "show-stale-banner", ingestionMode: "polling-fallback", analystImpact: "values-may-be-old" };
  }

  if (stream.burstRate > stream.maxRenderableRate) {
    return { action: "coalesce-updates", ingestionMode: "throttled-stream", analystImpact: "intermediate-frames-hidden" };
  }

  if (stream.connectionFlaps > 2) {
    return { action: "pause-and-reconnect", ingestionMode: "manual-resume", analystImpact: "operator-review-needed" };
  }

  return { action: "render-live", ingestionMode: "streaming", analystImpact: "none" };
}

console.log(streamFallback({ lagMs: 6200, burstRate: 10, maxRenderableRate: 6, connectionFlaps: 0 }));
