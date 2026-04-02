function evaluatePushFanout(cases) {
  return cases.map((entry) => ({
    batch: entry.batch,
    priority: entry.urgent ? "high" : entry.marketing ? "normal" : "background",
    splitByPlatform: entry.androidTokens > 0 && entry.iosTokens > 0,
    delayForTokenRefresh: entry.invalidRate > 0.1
  }));
}

console.log(JSON.stringify(evaluatePushFanout([
  { batch: "critical", urgent: true, marketing: false, androidTokens: 30, iosTokens: 20, invalidRate: 0.01 },
  { batch: "promo", urgent: false, marketing: true, androidTokens: 200, iosTokens: 150, invalidRate: 0.08 },
  { batch: "cleanup", urgent: false, marketing: false, androidTokens: 10, iosTokens: 0, invalidRate: 0.22 }
]), null, 2));
