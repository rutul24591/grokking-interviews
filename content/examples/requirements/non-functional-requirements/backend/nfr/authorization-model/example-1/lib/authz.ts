export type Role = "admin" | "editor" | "viewer";
export type Action = "read" | "edit" | "delete";

export type User = { id: string; role: Role; orgId: string };
export type Doc = { id: string; orgId: string; ownerId: string; classification: "public" | "internal" };

export const USERS: User[] = [
  { id: "u_admin", role: "admin", orgId: "org1" },
  { id: "u_editor", role: "editor", orgId: "org1" },
  { id: "u_viewer", role: "viewer", orgId: "org1" },
  { id: "u_other_org", role: "admin", orgId: "org2" }
];

export const DOCS: Doc[] = [
  { id: "d1", orgId: "org1", ownerId: "u_editor", classification: "internal" },
  { id: "d2", orgId: "org1", ownerId: "u_viewer", classification: "public" },
  { id: "d3", orgId: "org2", ownerId: "u_other_org", classification: "internal" }
];

export function getUser(id: string) {
  return USERS.find((u) => u.id === id) || null;
}

export function getDoc(id: string) {
  return DOCS.find((d) => d.id === id) || null;
}

export function evaluate(user: User, doc: Doc, action: Action) {
  const trace: string[] = [];

  // Tenant boundary first (ABAC)
  if (user.orgId !== doc.orgId) {
    trace.push("deny: cross-org access");
    return { allowed: false, trace };
  }
  trace.push("ok: same org");

  // Classification (ABAC)
  if (doc.classification === "internal" && user.role === "viewer" && action !== "read") {
    trace.push("deny: viewers cannot modify internal docs");
    return { allowed: false, trace };
  }
  trace.push("ok: classification policy");

  // RBAC
  if (user.role === "admin") {
    trace.push("allow: admin");
    return { allowed: true, trace };
  }
  if (user.role === "editor") {
    if (action === "delete") {
      trace.push("deny: editors cannot delete");
      return { allowed: false, trace };
    }
    trace.push("allow: editor read/edit");
    return { allowed: true, trace };
  }

  // viewer
  if (action === "read") {
    trace.push("allow: viewer read");
    return { allowed: true, trace };
  }
  trace.push("deny: viewer non-read");
  return { allowed: false, trace };
}

export function visibleDocs(user: User) {
  return DOCS.filter((d) => d.orgId === user.orgId);
}

