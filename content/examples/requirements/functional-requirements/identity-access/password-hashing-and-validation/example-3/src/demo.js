function storageDecision({ reused, characterClasses, breached, deviceGenerated }) {
  if (breached || reused) return "reject";
  if (characterClasses < 3) return "require-stronger-password";
  return deviceGenerated ? "accept-and-flag-as-generated" : "accept";
}

console.log(storageDecision({ reused: false, characterClasses: 4, breached: false, deviceGenerated: false }));
console.log(storageDecision({ reused: false, characterClasses: 2, breached: false, deviceGenerated: true }));
