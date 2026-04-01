function resolvePolicy(decisions) {
  if (decisions.includes("deny")) return "deny";
  if (decisions.includes("allow")) return "allow";
  return "deny";
}

console.log(resolvePolicy(["allow", "allow"]));
console.log(resolvePolicy(["allow", "deny"]));
