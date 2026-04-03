export const localeSources = [
  "URL prefix",
  "Explicit saved user preference",
  "Accept-Language header",
  "Geo fallback"
];

export const localeCandidates = ["en", "fr", "ar", "ja"];
export const localePolicies = [
  "URL locale wins for explicit deep links.",
  "Persist profile preference after the first authenticated resolution.",
  "Redirect only when the forced locale conflicts with the route locale.",
  "Keep example tabs in the same locale as the article route."
];
