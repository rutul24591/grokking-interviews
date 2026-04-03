function chooseNotificationRouting(session) {
  const pushAllowed = !session.muted && session.pushEnabled && session.deliveryState === "healthy";
  return {
    id: session.id,
    pushAllowed,
    inboxMode: session.urgentCount > 0 ? "elevated-urgent-lane" : "standard-inbox",
    dedupeRequired: session.channelCount > 1,
    digestRoutine: session.digestMode && session.urgentCount === 0
  };
}

const sessions = [
  { id: "ops", muted: false, pushEnabled: true, deliveryState: "healthy", urgentCount: 2, channelCount: 2, digestMode: false },
  { id: "social", muted: false, pushEnabled: false, deliveryState: "lagging", urgentCount: 0, channelCount: 1, digestMode: true },
  { id: "muted", muted: true, pushEnabled: true, deliveryState: "healthy", urgentCount: 1, channelCount: 2, digestMode: false }
];

const plans = sessions.map(chooseNotificationRouting);
console.log(plans);
console.log({ pushSuppressed: plans.filter((plan) => !plan.pushAllowed).length });
