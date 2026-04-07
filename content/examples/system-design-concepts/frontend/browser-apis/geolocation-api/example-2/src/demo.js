function planGeolocationRefresh(flow) {
  const actions = [];
  if (flow.permissionState === "denied") actions.push("manual-address-fallback");
  if (flow.highAccuracy && flow.viewVisible) actions.push("allow-precision-while-foregrounded");
  if (flow.staleSeconds > 60) actions.push("block-precision-actions");
  return {
    id: flow.id,
    actions,
    requestMode: flow.highAccuracy && flow.viewVisible ? "precise" : "coarse",
    shipReady: !actions.includes("manual-address-fallback") || flow.manualAddressVisible
  };
}

const flows = [
  { id: "locator", permissionState: "granted", highAccuracy: false, viewVisible: true, staleSeconds: 12, manualAddressVisible: true },
  { id: "route", permissionState: "granted", highAccuracy: true, viewVisible: true, staleSeconds: 20, manualAddressVisible: true },
  { id: "denied", permissionState: "denied", highAccuracy: false, viewVisible: true, staleSeconds: 300, manualAddressVisible: false }
];

console.log(flows.map(planGeolocationRefresh));
