function mergeSliceResponse(existingWindows, incomingWindow) {
  if (existingWindows.includes(incomingWindow.cursor)) {
    return { action: "drop-duplicate-window", cursor: incomingWindow.cursor, invalidateCache: false };
  }

  if (incomingWindow.outOfOrder) {
    return { action: "re-sort-window-buffer", cursor: incomingWindow.cursor, invalidateCache: true };
  }

  if (incomingWindow.gapDetected) {
    return { action: "request-missing-window", cursor: incomingWindow.cursor, invalidateCache: true };
  }

  return { action: "append-window", cursor: incomingWindow.cursor, invalidateCache: false };
}

console.log(mergeSliceResponse(["10k-20k"], { cursor: "30k-40k", outOfOrder: false, gapDetected: true }));
