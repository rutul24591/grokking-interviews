type Rule = { effect: "allow" | "deny"; when: () => boolean; name: string };

function evalPolicy(rules: Rule[]) {
  // Deny precedence is a common safety property.
  const matched = rules.filter((r) => r.when());
  const deny = matched.find((r) => r.effect === "deny");
  if (deny) return { allowed: false, matched: matched.map((r) => r.name), deny: deny.name };
  const allow = matched.find((r) => r.effect === "allow");
  return { allowed: !!allow, matched: matched.map((r) => r.name) };
}

const rules: Rule[] = [
  { effect: "allow", name: "role_admin", when: () => true },
  { effect: "deny", name: "doc_locked", when: () => true }
];

console.log(JSON.stringify(evalPolicy(rules), null, 2));

