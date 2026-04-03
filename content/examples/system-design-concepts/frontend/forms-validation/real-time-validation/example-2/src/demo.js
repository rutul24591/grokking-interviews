function scheduleValidator({ pendingRequest, typedValue, lastCommittedValue, lastRequestedValue }) {
  if (!typedValue) return { action: "idle", reason: "empty-value" };
  if (typedValue === lastCommittedValue) return { action: "reuse-last-success", reason: "same-value" };
  if (typedValue === lastRequestedValue) return { action: "wait-existing-request", reason: "duplicate-candidate" };
  if (pendingRequest) return { action: "cancel-and-replace", reason: "newer-input-arrived" };
  return { action: "debounce-and-run", reason: "new-candidate" };
}

console.log([
  { pendingRequest: true, typedValue: "platform-ops", lastCommittedValue: "platform", lastRequestedValue: "platform" },
  { pendingRequest: false, typedValue: "platform-core", lastCommittedValue: "platform-core", lastRequestedValue: "platform-core" },
  { pendingRequest: false, typedValue: "", lastCommittedValue: "platform", lastRequestedValue: "platform" }
].map(scheduleValidator));
