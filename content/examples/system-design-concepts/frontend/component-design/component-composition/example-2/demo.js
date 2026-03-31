function validateSlots(slots) {
  const required = ["hero", "body", "rail"];
  const missing = required.filter((slot) => !slots[slot]);
  return { valid: missing.length === 0, missing };
}

console.log(validateSlots({ hero: true, body: true, rail: true }));
console.log(validateSlots({ hero: true, body: true }));
