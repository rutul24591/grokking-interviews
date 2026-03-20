import { bumpType } from "./semver";

export type Dep = {
  name: string;
  version: string;
  license: "MIT" | "Apache-2.0" | "GPL-3.0";
  advisory: "none" | "low" | "high" | "critical";
};

export type Proposal = { name: string; from: string; to: string };

export function evaluate(params: {
  deps: Dep[];
  upgrades: Proposal[];
  approvedByHuman: boolean;
}) {
  const byName = new Map(params.deps.map((d) => [d.name, d] as const));
  const reasons: string[] = [];

  for (const u of params.upgrades) {
    const d = byName.get(u.name);
    if (!d) {
      reasons.push(`Unknown dependency: ${u.name}`);
      continue;
    }
    if (d.license === "GPL-3.0") reasons.push(`Blocked license for ${d.name}`);
    if (d.advisory === "critical") reasons.push(`Critical advisory for ${d.name}`);
    const bump = bumpType(u.from, u.to);
    if (bump === "major" && !params.approvedByHuman) reasons.push(`Major upgrade requires approval: ${d.name}`);
  }

  const ok = reasons.length === 0;
  return { ok, reasons };
}

