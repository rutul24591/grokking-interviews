function planBatteryMode(session) {
  const actions = [];
  const refreshWindow = session.batteryPct <= 20 ? 60 : 15;
  if (session.batteryPct <= 20) actions.push("reduce-polling");
  if (session.batteryPct <= 20 && session.motionEnabled) actions.push("disable-preview-motion");
  if (!session.signalAvailable) actions.push("fallback-to-generic-power-profile");
  if (session.manualOverride === "always-rich") actions.push("respect-user-override");
  return {
    id: session.id,
    refreshWindow,
    actions,
    shipReady: !actions.includes("fallback-to-generic-power-profile") || session.genericProfileDocumented
  };
}

const sessions = [
  { id: "desk", batteryPct: 91, signalAvailable: true, motionEnabled: true, manualOverride: "default", genericProfileDocumented: true },
  { id: "train", batteryPct: 12, signalAvailable: true, motionEnabled: true, manualOverride: "default", genericProfileDocumented: true },
  { id: "blocked", batteryPct: null, signalAvailable: false, motionEnabled: false, manualOverride: "always-rich", genericProfileDocumented: false }
];

const plans = sessions.map(planBatteryMode);
console.log(plans);
console.log({ fallbackPaths: plans.filter((plan) => plan.actions.includes("fallback-to-generic-power-profile")).map((plan) => plan.id) });
