function evaluateEmailRouting(cases) {
  return cases.map((entry) => ({
    mail: entry.mail,
    route: entry.transactional ? "transactional-provider" : entry.bulk ? "campaign-provider" : "default-provider",
    useFallback: entry.providerHealthy === false || entry.regionBlocked,
    suppressSend: entry.onSuppressionList
  }));
}

console.log(JSON.stringify(evaluateEmailRouting([
  { mail: "reset", transactional: true, bulk: false, providerHealthy: true, regionBlocked: false, onSuppressionList: false },
  { mail: "digest", transactional: false, bulk: true, providerHealthy: false, regionBlocked: false, onSuppressionList: false },
  { mail: "receipt", transactional: true, bulk: false, providerHealthy: true, regionBlocked: true, onSuppressionList: true }
]), null, 2));
