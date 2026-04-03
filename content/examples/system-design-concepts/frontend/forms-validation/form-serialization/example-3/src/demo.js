function detectHiddenFieldLeak({ visibleSections, payload }) {
  const leakedKeys = [];
  if (!visibleSections.includes("giftWrap") && payload.giftWrap) leakedKeys.push("giftWrap");
  if (!visibleSections.includes("instructions") && payload.shipping?.instructions) leakedKeys.push("shipping.instructions");
  if (!visibleSections.includes("webhook") && payload.notifications?.webhook) leakedKeys.push("notifications.webhook");
  return { leakedKeys, status: leakedKeys.length ? "strip-before-submit" : "ok" };
}

console.log([
  {
    visibleSections: ["customer", "notifications"],
    payload: { shipping: { mode: "standard", instructions: "Leave at gate" }, giftWrap: { enabled: true }, notifications: { webhook: true } }
  },
  {
    visibleSections: ["customer", "instructions", "giftWrap", "webhook"],
    payload: { shipping: { mode: "standard", instructions: "Leave at gate" }, giftWrap: { enabled: true }, notifications: { webhook: true } }
  }
].map(detectHiddenFieldLeak));
