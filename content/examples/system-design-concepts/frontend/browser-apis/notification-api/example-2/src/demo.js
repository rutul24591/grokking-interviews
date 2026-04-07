function planBrowserNotificationLane(flow) {
  const actions = [];
  if (flow.permissionState === "denied") actions.push("inbox-only-fallback");
  if (flow.urgency === "digest") actions.push("prefer-digest-lane");
  if (flow.quietHours) actions.push("suppress-native-delivery");
  return {
    id: flow.id,
    actions,
    deliveryLane: flow.permissionState === "granted" && flow.urgency === "urgent" && !flow.quietHours ? "native+inbox" : "inbox-or-digest",
    shipReady: !actions.includes("inbox-only-fallback") || flow.inboxMirrorVisible
  };
}

const flows = [
  { id: "urgent", permissionState: "granted", urgency: "urgent", quietHours: false, inboxMirrorVisible: true },
  { id: "digest", permissionState: "granted", urgency: "digest", quietHours: true, inboxMirrorVisible: true },
  { id: "denied", permissionState: "denied", urgency: "urgent", quietHours: false, inboxMirrorVisible: false }
];

console.log(flows.map(planBrowserNotificationLane));
