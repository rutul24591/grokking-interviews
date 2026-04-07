function detectNotificationFallbackRisk(state) {
  const blockers = [];
  if (state.deniedPermission && !state.promptSuppressed) blockers.push("denied-user-still-being-prompted");
  if (state.nonUrgentSentNativeDuringQuietHours) blockers.push("quiet-hours-policy-broken");
  if (!state.inboxMirrorVisible) blockers.push("notification-history-missing");
  if (state.urgentAlertRoutedToDigest) blockers.push("urgent-alert-buried-in-digest");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", deniedPermission: false, promptSuppressed: true, nonUrgentSentNativeDuringQuietHours: false, inboxMirrorVisible: true, urgentAlertRoutedToDigest: false },
  { id: "broken", deniedPermission: true, promptSuppressed: false, nonUrgentSentNativeDuringQuietHours: true, inboxMirrorVisible: false, urgentAlertRoutedToDigest: true }
];

console.log(states.map(detectNotificationFallbackRisk));
