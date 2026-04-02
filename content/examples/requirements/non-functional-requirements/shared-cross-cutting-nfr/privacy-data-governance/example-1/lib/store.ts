import type { Purpose, Profile } from "./policy";

export type AuditEvent = {
  ts: string;
  actor: string;
  userId: string;
  purpose: Purpose | "dsar_delete";
  action: "read" | "delete";
};

type Store = {
  profiles: Map<string, Profile>;
  audit: AuditEvent[];
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__PRIV_STORE__ as Store | undefined) ?? {
    profiles: new Map([
      ["u1", { userId: "u1", displayName: "Ada", email: "ada@example.com", phone: "5550101", address: "1 Main St", deleted: false }],
      ["u2", { userId: "u2", displayName: "Grace", email: "grace@example.com", phone: "5550102", address: "2 Main St", deleted: false }],
    ]),
    audit: [],
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__PRIV_STORE__ = store;

export function listUsers() {
  return [...store.profiles.values()].map((p) => ({ userId: p.userId, displayName: p.displayName, deleted: p.deleted }));
}

export function getProfile(userId: string) {
  return store.profiles.get(userId);
}

export function addAudit(e: AuditEvent) {
  store.audit.push(e);
  if (store.audit.length > 2000) store.audit.splice(0, store.audit.length - 2000);
}

export function auditLog() {
  return store.audit.slice().reverse().slice(0, 200);
}

export function dsarDelete(userId: string) {
  const p = store.profiles.get(userId);
  if (!p) return false;
  store.profiles.set(userId, { ...p, email: "", phone: "", address: "", deleted: true });
  return true;
}

export function reset() {
  store.audit = [];
  store.profiles.set("u1", { userId: "u1", displayName: "Ada", email: "ada@example.com", phone: "5550101", address: "1 Main St", deleted: false });
  store.profiles.set("u2", { userId: "u2", displayName: "Grace", email: "grace@example.com", phone: "5550102", address: "2 Main St", deleted: false });
}

