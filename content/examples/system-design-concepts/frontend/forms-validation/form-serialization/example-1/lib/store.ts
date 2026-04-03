export const serializationDefaults = {
  customer: { name: "", email: "", tier: "enterprise" },
  shipping: { mode: "standard", instructions: "", requiresSignature: false },
  notifications: { email: true, sms: false, webhook: false },
  tags: ["priority-review"],
  giftWrap: { enabled: false, note: "" }
};

export const serializationNotes = [
  "Empty optional fields should be omitted from the payload.",
  "Unchecked channels should serialize to false when the API expects explicit booleans.",
  "Hidden step data must be removed when the controlling toggle turns off.",
  "Derived summary fields should never leak into the wire payload."
];

export const destinationSchemas = [
  "Create order payload for the checkout API.",
  "Audit event payload for support review.",
  "Queue payload for downstream fulfillment."
];
