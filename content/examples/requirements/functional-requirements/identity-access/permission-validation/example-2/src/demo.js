function inheritedDecision(grants, roleOrder, role, action) {
  const idx = roleOrder.indexOf(role);
  const path = roleOrder.slice(0, idx + 1);
  return {
    path,
    allowed: path.some((candidate) => grants.includes(`${candidate}:${action}`))
  };
}

console.log(inheritedDecision(["viewer:view-draft", "editor:edit-draft"], ["viewer", "editor", "admin"], "admin", "edit-draft"));
console.log(inheritedDecision(["viewer:view-draft"], ["viewer", "editor", "admin"], "editor", "users.manage"));
