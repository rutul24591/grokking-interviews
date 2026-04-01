function consentOutcome({ granted, providerAvailable, userCancelled }) {
  if (!providerAvailable) return "show-provider-unavailable";
  if (userCancelled) return "return-to-provider-picker";
  return granted ? "exchange-code" : "show-consent-error";
}

console.log(consentOutcome({ granted: false, providerAvailable: true, userCancelled: true }));
console.log(consentOutcome({ granted: true, providerAvailable: false, userCancelled: false }));
