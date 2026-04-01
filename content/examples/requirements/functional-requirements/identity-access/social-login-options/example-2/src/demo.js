function providerMatches(useCase) {
  if (useCase.enterpriseSso) return "microsoft";
  if (useCase.developerAudience) return "github";
  return "google";
}

console.log(providerMatches({ enterpriseSso: false, developerAudience: true }));
console.log(providerMatches({ enterpriseSso: true, developerAudience: false }));
