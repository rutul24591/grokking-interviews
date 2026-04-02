function chooseGatewayRoute(payments) {
  return payments.map((payment) => ({
    id: payment.id,
    route: payment.region === "EU" ? "adyen" : payment.riskScore > 70 ? "hybrid-failover" : "stripe",
    holdForReview: payment.riskScore > 90,
    enableFallback: payment.retryBudget > 0
  }));
}

console.log(chooseGatewayRoute([
  { id: "pay-1", region: "US", riskScore: 22, retryBudget: 1 },
  { id: "pay-2", region: "EU", riskScore: 95, retryBudget: 2 }
]));
