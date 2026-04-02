import { randomUUID } from "node:crypto";
import type { Dep, Proposal } from "./policy";
import { evaluate } from "./policy";

export type ProposalRecord = {
  id: string;
  upgrades: Proposal[];
  createdAt: string;
  status: "created" | "approved" | "applied" | "rejected";
  reasons: string[];
};

type Store = {
  deps: Dep[];
  proposals: ProposalRecord[];
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__DEP_STORE__ as Store | undefined) ?? {
    deps: [
      { name: "next", version: "16.1.6", license: "MIT", advisory: "none" },
      { name: "zod", version: "3.24.1", license: "MIT", advisory: "none" },
      { name: "legacy-lib", version: "1.2.3", license: "GPL-3.0", advisory: "high" },
      { name: "crypto-lib", version: "2.0.0", license: "Apache-2.0", advisory: "critical" },
    ],
    proposals: [],
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__DEP_STORE__ = store;

export function listDeps() {
  return store.deps.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function listProposals() {
  return store.proposals.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createProposal(upgrades: Proposal[]): ProposalRecord {
  const r = evaluate({ deps: store.deps, upgrades, approvedByHuman: false });
  const status: ProposalRecord["status"] = r.ok ? "created" : "rejected";
  const rec: ProposalRecord = {
    id: randomUUID(),
    upgrades,
    createdAt: new Date().toISOString(),
    status,
    reasons: r.reasons,
  };
  store.proposals.push(rec);
  return rec;
}

export function approveProposal(id: string): ProposalRecord | undefined {
  const rec = store.proposals.find((p) => p.id === id);
  if (!rec) return undefined;
  if (rec.status !== "created") return rec;
  const r = evaluate({ deps: store.deps, upgrades: rec.upgrades, approvedByHuman: true });
  rec.reasons = r.reasons;
  rec.status = r.ok ? "approved" : "rejected";
  return rec;
}

export function applyProposal(id: string): ProposalRecord | undefined {
  const rec = store.proposals.find((p) => p.id === id);
  if (!rec) return undefined;
  if (rec.status !== "approved" && rec.status !== "created") return rec;

  // For demo: auto-apply created proposals only if still ok under policy w/out approval (patch-only).
  const r = evaluate({ deps: store.deps, upgrades: rec.upgrades, approvedByHuman: rec.status === "approved" });
  if (!r.ok) {
    rec.status = "rejected";
    rec.reasons = r.reasons;
    return rec;
  }

  for (const u of rec.upgrades) {
    const d = store.deps.find((x) => x.name === u.name);
    if (d) d.version = u.to;
  }
  rec.status = "applied";
  return rec;
}

export function reset() {
  store.proposals = [];
}

