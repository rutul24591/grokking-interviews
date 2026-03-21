import { ContextSchema, RuleSchema, evaluate } from "./pac";

const rules = [
  { name: "freeze blocks non-emergency", when: { freezeEnabled: true, emergency: false }, effect: "deny", reason: "Freeze window" },
  { name: "critical needs 2 approvals", when: { riskIn: ["critical"], minApprovals: 2 }, effect: "allow", reason: "Approved" },
  { name: "default allow low", when: { riskIn: ["low", "medium"], minApprovals: 1 }, effect: "allow", reason: "Approved" },
].map((r) => RuleSchema.parse(r));

const ctx = ContextSchema.parse({ risk: "critical", emergency: true, freezeEnabled: true, approvals: 2 });
console.log(evaluate(ctx, rules));

