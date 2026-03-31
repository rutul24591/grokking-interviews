const contracts = {
  scroll_depth: ["articleId", "value"],
  share_click: ["articleId", "channel"],
  bookmark: ["articleId"]
};

function validateEvent(event) {
  const required = contracts[event.type];
  if (!required) return { ok: false, reason: "unknown event type" };
  const missing = required.filter((key) => event[key] === undefined);
  return missing.length === 0 ? { ok: true } : { ok: false, reason: `missing ${missing.join(", ")}` };
}

console.log(validateEvent({ type: "scroll_depth", articleId: "a1", value: 70 }));
console.log(validateEvent({ type: "share_click", articleId: "a1" }));
