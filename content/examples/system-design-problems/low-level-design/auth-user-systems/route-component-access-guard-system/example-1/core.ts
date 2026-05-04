export type Permission = string;

export type RouteRule = {
  path: string;
  requiredAny?: Permission[];
  requiredAll?: Permission[];
};

export function canAccess(args: { rule: RouteRule; userPermissions: Set<Permission> }) {
  const { rule, userPermissions } = args;
  if (rule.requiredAll) for (const p of rule.requiredAll) if (!userPermissions.has(p)) return false;
  if (rule.requiredAny && rule.requiredAny.length) {
    for (const p of rule.requiredAny) if (userPermissions.has(p)) return true;
    return false;
  }
  return true;
}

export function guardRedirect(args: { ok: boolean; loginPath: string; forbiddenPath: string }) {
  if (args.ok) return null;
  // caller can distinguish auth vs forbidden based on session state
  return args.forbiddenPath || args.loginPath;
}
