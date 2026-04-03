export const translationKeys = [
  { key: "checkout.pay_now", locale: "en", status: "approved", owner: "checkout-team" },
  { key: "checkout.pay_now", locale: "fr", status: "review", owner: "localization-review" },
  { key: "checkout.pay_now", locale: "ar", status: "missing", owner: "localization-review" },
  { key: "checkout.error_card", locale: "fr", status: "review", owner: "checkout-team" }
];

export const translationPolicies = [
  "Do not publish locales with critical CTA keys still missing.",
  "Track review status separately from runtime loading status.",
  "Namespace ownership should be explicit for operational translation fixes.",
  "Missing critical CTA keys block the example tab as well as the article surface."
];
