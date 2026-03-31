const order = ["landing", "article", "signup", "pricing", "checkout"];

function validateSession(events) {
  const seen = new Set();
  let cursor = 0;
  for (const event of events) {
    const index = order.indexOf(event.stage);
    if (index === -1) return { valid: false, reason: `unknown stage ${event.stage}` };
    if (seen.has(event.stage)) continue;
    if (index < cursor) return { valid: false, reason: `replayed backwards at ${event.stage}` };
    if (index > cursor) return { valid: false, reason: `skipped ${order[cursor]}` };
    seen.add(event.stage);
    cursor += 1;
  }
  return { valid: true, completedStages: [...seen] };
}

console.log(validateSession([{ stage: "landing" }, { stage: "article" }, { stage: "signup" }]));
console.log(validateSession([{ stage: "landing" }, { stage: "signup" }]));
