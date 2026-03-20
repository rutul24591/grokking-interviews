type Signals = { dnt?: "0" | "1"; gpc?: boolean; region: "us" | "eu" | "other" };

function effectivePolicy(s: Signals) {
  // Simplified rule set (illustrative):
  // - EU: analytics default off unless user opts-in
  // - DNT=1 or GPC=true: treat analytics/marketing as off
  if (s.dnt === "1" || s.gpc === true) return { analyticsAllowed: false, marketingAllowed: false };
  if (s.region === "eu") return { analyticsAllowed: false, marketingAllowed: false };
  return { analyticsAllowed: true, marketingAllowed: false };
}

const samples: Signals[] = [
  { region: "eu" },
  { region: "us" },
  { region: "us", dnt: "1" },
  { region: "other", gpc: true }
];

console.log(JSON.stringify(samples.map((s) => ({ s, policy: effectivePolicy(s) })), null, 2));

