export type RoleId = string;
export type PermissionId = string;

export type Role = { id: RoleId; name: string; permissions: PermissionId[] };

export type Policy = {
  roleById: Record<RoleId, Role>;
  impliedPermissions: Record<PermissionId, PermissionId[]>; // e.g. admin implies read/write
};

export function expandPermissions(policy: Policy, direct: PermissionId[]) {
  const out = new Set<PermissionId>(direct);
  const stack = [...direct];
  while (stack.length) {
    const p = stack.pop()!;
    for (const implied of policy.impliedPermissions[p] ?? []) {
      if (!out.has(implied)) {
        out.add(implied);
        stack.push(implied);
      }
    }
  }
  return [...out].sort();
}

export function can(policy: Policy, roleIds: RoleId[], permission: PermissionId) {
  const direct: PermissionId[] = [];
  for (const rid of roleIds) direct.push(...(policy.roleById[rid]?.permissions ?? []));
  const expanded = expandPermissions(policy, direct);
  return expanded.includes(permission);
}

export function diffRolePermissions(before: Role, after: Role) {
  const b = new Set(before.permissions);
  const a = new Set(after.permissions);
  const added = [...a].filter((p) => !b.has(p));
  const removed = [...b].filter((p) => !a.has(p));
  return { added, removed };
}
