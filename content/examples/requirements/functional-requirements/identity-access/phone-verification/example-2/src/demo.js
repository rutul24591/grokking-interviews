function normalizePhone(input) {
  return input.replace(/[^\d+]/g, "");
}

function isDeliverable(phone) {
  const normalized = normalizePhone(phone);
  return normalized.startsWith("+") && normalized.length >= 11 && normalized.length <= 16;
}

console.log(isDeliverable("+1 415 555 0123"));
console.log(isDeliverable("555-01"));
