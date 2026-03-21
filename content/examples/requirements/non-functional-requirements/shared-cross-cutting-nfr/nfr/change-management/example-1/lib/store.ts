import { randomUUID } from "node:crypto";
import type { Risk } from "./policy";

export type ChangeStatus = "draft" | "pending" | "approved" | "executed" | "rejected";

export type AuditEvent = {
  ts: string;
  type: "created" | "submitted" | "approved" | "executed" | "rejected" | "freeze_updated";
  actor: string;
  message: string;
};

export type Change = {
  id: string;
  title: string;
  risk: Risk;
  emergency: boolean;
  status: ChangeStatus;
  createdAt: string;
  updatedAt: string;
  approvals: Array<{ approver: string; role: string; ts: string }>;
  audit: AuditEvent[];
};

type Freeze = { enabled: boolean; reason: string; until: string | null; updatedAt: string };

type Store = {
  changes: Map<string, Change>;
  freeze: Freeze;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__CHANGE_STORE__ as Store | undefined) ?? {
    changes: new Map(),
    freeze: { enabled: false, reason: "", until: null, updatedAt: new Date().toISOString() },
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__CHANGE_STORE__ = store;

export function listChanges(): Change[] {
  return [...store.changes.values()].slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getChange(id: string): Change | undefined {
  return store.changes.get(id);
}

export function createChange(params: { title: string; risk: Risk; emergency: boolean; actor: string }): Change {
  const now = new Date().toISOString();
  const c: Change = {
    id: randomUUID(),
    title: params.title,
    risk: params.risk,
    emergency: params.emergency,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    approvals: [],
    audit: [{ ts: now, type: "created", actor: params.actor, message: `Created (${params.risk})` }],
  };
  store.changes.set(c.id, c);
  return c;
}

export function submitChange(id: string, actor: string) {
  const c = store.changes.get(id);
  if (!c) return;
  if (c.status !== "draft") return;
  c.status = "pending";
  c.updatedAt = new Date().toISOString();
  c.audit.push({ ts: c.updatedAt, type: "submitted", actor, message: "Submitted for approval" });
}

export function approveChange(id: string, actor: string, role: string) {
  const c = store.changes.get(id);
  if (!c) return;
  if (c.status === "executed" || c.status === "rejected") return;
  if (c.approvals.some((a) => a.approver === actor)) return;
  const ts = new Date().toISOString();
  c.approvals.push({ approver: actor, role, ts });
  c.updatedAt = ts;
  c.audit.push({ ts, type: "approved", actor, message: `Approved (${role})` });
}

export function executeChange(id: string, actor: string) {
  const c = store.changes.get(id);
  if (!c) return;
  const ts = new Date().toISOString();
  c.status = "executed";
  c.updatedAt = ts;
  c.audit.push({ ts, type: "executed", actor, message: "Executed" });
}

export function freezeUpdate(params: { enabled: boolean; reason: string; until: string | null; actor: string }) {
  const ts = new Date().toISOString();
  store.freeze = { enabled: params.enabled, reason: params.reason, until: params.until, updatedAt: ts };
  // Append event to all changes for visibility (demo).
  for (const c of store.changes.values()) {
    c.audit.push({
      ts,
      type: "freeze_updated",
      actor: params.actor,
      message: params.enabled ? `Freeze enabled: ${params.reason}` : "Freeze disabled",
    });
    c.updatedAt = ts;
  }
}

export function getFreeze() {
  return store.freeze;
}

export function reset() {
  store.changes.clear();
  store.freeze = { enabled: false, reason: "", until: null, updatedAt: new Date().toISOString() };
}

