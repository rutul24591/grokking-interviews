function evaluateNotificationChannels(cases) {
  return cases.map((entry) => ({
    notification: entry.notification,
    channel: entry.urgent ? "push" : entry.hasVerifiedEmail ? "email" : "sms",
    addFallback: entry.regulated || entry.deliverySlaMinutes < 5,
    holdForPreferenceReview: !entry.userOptIn
  }));
}

console.log(JSON.stringify(evaluateNotificationChannels([
  { notification: "payment", urgent: true, hasVerifiedEmail: true, regulated: true, deliverySlaMinutes: 2, userOptIn: true },
  { notification: "digest", urgent: false, hasVerifiedEmail: true, regulated: false, deliverySlaMinutes: 1440, userOptIn: true },
  { notification: "sms-only", urgent: false, hasVerifiedEmail: false, regulated: false, deliverySlaMinutes: 10, userOptIn: false }
]), null, 2));
