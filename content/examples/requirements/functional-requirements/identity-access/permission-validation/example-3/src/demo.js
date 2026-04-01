function resolveConflict({ allow, deny, breakGlass }) {
  if (breakGlass) return "allow-with-audit";
  if (deny) return "deny";
  if (allow) return "allow";
  return "deny";
}

console.log(resolveConflict({ allow: true, deny: true, breakGlass: false }));
console.log(resolveConflict({ allow: true, deny: true, breakGlass: true }));
