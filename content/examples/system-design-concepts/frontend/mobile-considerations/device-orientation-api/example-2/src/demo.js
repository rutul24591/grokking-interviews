function chooseOrientationHandling(session) {
  const requestPermission = session.userInitiated && session.permission === "prompt";
  const orientationMode = session.permission === "granted" && session.sensorEnabled
    ? session.orientation === "landscape" ? "media-priority-layout" : "reading-priority-layout"
    : "static-responsive-layout";
  return {
    id: session.id,
    requestPermission,
    orientationMode,
    followUp: session.permission === "denied" ? "verify-fallback" : session.rotationRatePerMinute > 8 ? "debounce-layout-swaps" : "healthy"
  };
}

const sessions = [
  { id: "prompt-reader", userInitiated: true, permission: "prompt", sensorEnabled: false, orientation: "portrait", rotationRatePerMinute: 1 },
  { id: "granted-video", userInitiated: true, permission: "granted", sensorEnabled: true, orientation: "landscape", rotationRatePerMinute: 3 },
  { id: "denied-device", userInitiated: false, permission: "denied", sensorEnabled: false, orientation: "portrait", rotationRatePerMinute: 0 }
];

console.log(sessions.map(chooseOrientationHandling));
