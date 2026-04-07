function planClipboardWriteFlow(flow) {
  const actions = [];
  if (flow.permissionState === "prompt") actions.push("show-confirm-before-copy");
  if (flow.sensitivePayload) actions.push("mask-preview-and-timeout");
  if (!flow.apiAvailable) actions.push("manual-selection-fallback");
  return {
    id: flow.id,
    actions,
    canUseNativeWrite: flow.apiAvailable && flow.permissionState !== "denied",
    shipReady: !actions.includes("manual-selection-fallback") || flow.manualInstructionsVisible
  };
}

const flows = [
  { id: "plain", permissionState: "granted", sensitivePayload: false, apiAvailable: true, manualInstructionsVisible: true },
  { id: "secret", permissionState: "prompt", sensitivePayload: true, apiAvailable: true, manualInstructionsVisible: true },
  { id: "legacy", permissionState: "denied", sensitivePayload: false, apiAvailable: false, manualInstructionsVisible: false }
];

console.log(flows.map(planClipboardWriteFlow));
