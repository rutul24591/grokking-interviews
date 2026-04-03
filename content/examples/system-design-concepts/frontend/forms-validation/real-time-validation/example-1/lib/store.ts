export const realtimeRules = [
  "Debounce validation until typing pauses.",
  "Ignore out-of-order responses from older requests.",
  "Surface temporary service throttling without clearing the latest valid state.",
  "Cancel in-flight requests when a more recent candidate is typed."
];

export const reservedHandles = ["admin", "ops", "support"];

export const validationServices = [
  "Handle availability service",
  "Environment quota service",
  "Rate-limit feedback channel"
];
