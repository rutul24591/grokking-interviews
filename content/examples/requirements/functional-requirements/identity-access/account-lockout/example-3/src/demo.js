function analyzeAttempts(accounts) {
  return accounts.map((account) => ({
    account: account.email,
    resetOnSuccess: account.outcomes.includes("success"),
    sprayRisk: account.outcomes.filter((outcome) => outcome === "failure").length < 3 && account.sharedSource,
  }));
}

console.log(analyzeAttempts([
  { email: "a@example.com", outcomes: ["failure", "failure", "success"], sharedSource: false },
  { email: "b@example.com", outcomes: ["failure", "failure"], sharedSource: true },
]));
