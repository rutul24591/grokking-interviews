export type Role = "admin" | "editor" | "reader";
export type Permission = "article:read" | "article:publish" | "admin:users:read";

const ROLE_PERMS: Record<Role, Permission[]> = {
  admin: ["article:read", "article:publish", "admin:users:read"],
  editor: ["article:read", "article:publish"],
  reader: ["article:read"]
};

export function hasPermission(role: Role, perm: Permission) {
  return ROLE_PERMS[role].includes(perm);
}

