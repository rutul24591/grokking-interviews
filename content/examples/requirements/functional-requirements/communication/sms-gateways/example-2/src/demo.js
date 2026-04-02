function evaluateSmsRouting(cases) {
  return cases.map((entry) => ({
    message: entry.message,
    route: entry.region === "IN" ? "gateway-india" : entry.region === "US" ? "gateway-us" : "gateway-global",
    requireFallback: entry.rateLimited || entry.primaryCarrierDown,
    blockSend: entry.recipientSuppressed
  }));
}

console.log(JSON.stringify(evaluateSmsRouting([
  { message: "otp", region: "IN", rateLimited: false, primaryCarrierDown: false, recipientSuppressed: false },
  { message: "alert", region: "US", rateLimited: true, primaryCarrierDown: false, recipientSuppressed: false },
  { message: "receipt", region: "BR", rateLimited: false, primaryCarrierDown: true, recipientSuppressed: true }
]), null, 2));
