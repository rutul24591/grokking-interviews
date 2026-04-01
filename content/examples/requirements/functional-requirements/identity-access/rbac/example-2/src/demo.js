function inherits(roleOrder, grants, role, action) {
  const cutoff = roleOrder.indexOf(role);
  return roleOrder.slice(0, cutoff + 1).some((candidate) => grants.includes(`${candidate}:${action}`));
}

console.log(inherits(["viewer", "editor", "admin"], ["viewer:dashboard.read", "editor:content.edit"], "admin", "content.edit"));
console.log(inherits(["viewer", "editor", "admin"], ["viewer:dashboard.read"], "editor", "users.manage"));
