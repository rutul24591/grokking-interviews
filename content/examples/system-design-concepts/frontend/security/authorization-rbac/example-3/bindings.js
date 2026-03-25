const ROLE_PERMS = {
  project_viewer: ["project:read"],
  project_editor: ["project:read", "project:write"],
  project_admin: ["project:read", "project:write", "project:admin"]
};

const bindings = [
  { userId: "u1", resource: "project:p1", role: "project_admin" },
  { userId: "u2", resource: "project:p1", role: "project_viewer" },
  { userId: "u2", resource: "project:p2", role: "project_editor" }
];

function can(userId, resource, perm) {
  const b = bindings.find((x) => x.userId === userId && x.resource === resource);
  if (!b) return false;
  return ROLE_PERMS[b.role].includes(perm);
}

process.stdout.write(`u2 can write p1? ${can("u2", "project:p1", "project:write")}\n`);
process.stdout.write(`u2 can write p2? ${can("u2", "project:p2", "project:write")}\n`);

