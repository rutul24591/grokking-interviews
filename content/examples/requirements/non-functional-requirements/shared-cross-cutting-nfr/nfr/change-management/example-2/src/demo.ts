import { ChangeSchema, requiredApprovals, score } from "./policy";

const change = ChangeSchema.parse({
  title: "db schema migration",
  risk: "high",
  emergency: false,
  hasRollbackPlan: true,
  touchesAuth: false,
  regions: 3,
});

const s = score(change);
console.log({ score: s, requiredApprovals: requiredApprovals(s) });

