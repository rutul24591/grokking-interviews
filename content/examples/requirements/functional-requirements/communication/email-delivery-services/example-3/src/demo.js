function detectEmailDeliveryFailures(cases) {
  return cases.map((entry) => ({
    mail: entry.mail,
    quarantineRecipient: entry.hardBounce,
    blockRetryLoop: entry.duplicateAttempt && entry.sameProviderMessageId,
    switchProvider: entry.softBounceStreak >= 3 || entry.providerOutage
  }));
}

console.log(JSON.stringify(detectEmailDeliveryFailures([
  { mail: "reset", hardBounce: false, duplicateAttempt: false, sameProviderMessageId: false, softBounceStreak: 0, providerOutage: false },
  { mail: "digest", hardBounce: false, duplicateAttempt: true, sameProviderMessageId: true, softBounceStreak: 4, providerOutage: false },
  { mail: "receipt", hardBounce: true, duplicateAttempt: false, sameProviderMessageId: false, softBounceStreak: 1, providerOutage: true }
]), null, 2));
