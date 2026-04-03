function serializeOrder(values) {
  const payload = {
    customer: { name: values.name, email: values.email, tier: values.tier },
    shipping: { mode: values.mode, requiresSignature: values.requiresSignature },
    notifications: { email: values.emailNotify, sms: values.smsNotify, webhook: values.webhookNotify }
  };
  if (values.instructions.trim()) payload.shipping.instructions = values.instructions;
  if (values.tags?.length) payload.tags = values.tags;
  if (values.giftWrap) payload.giftWrap = { enabled: true, note: values.giftNote };
  return payload;
}

console.log([
  {
    name: "Rutu",
    email: "rutu@company.com",
    tier: "enterprise",
    mode: "priority",
    instructions: "Call before delivery",
    requiresSignature: true,
    emailNotify: true,
    smsNotify: false,
    webhookNotify: false,
    tags: ["priority-review"],
    giftWrap: true,
    giftNote: "Launch day"
  },
  {
    name: "Ops",
    email: "ops@company.com",
    tier: "team",
    mode: "standard",
    instructions: "",
    requiresSignature: false,
    emailNotify: true,
    smsNotify: true,
    webhookNotify: true,
    tags: [],
    giftWrap: false,
    giftNote: ""
  }
].map(serializeOrder));
