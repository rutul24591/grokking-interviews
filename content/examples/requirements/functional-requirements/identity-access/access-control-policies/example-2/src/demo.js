function evaluatePrecedence(rules) {
  const explicitDeny = rules.find((rule) => rule.effect === "deny");
  if (explicitDeny) return { effect: "deny", reason: explicitDeny.reason };
  const allow = rules.find((rule) => rule.effect === "allow");
  return allow ? { effect: "allow", reason: allow.reason } : { effect: "deny", reason: "deny-by-default" };
}

console.log(evaluatePrecedence([
  { source: "role:editor", effect: "allow", reason: "Editors may edit drafts." },
  { source: "resource:billing-report", effect: "deny", reason: "Billing reports stay outside editor scope." },
]));
