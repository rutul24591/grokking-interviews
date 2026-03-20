import { SuppressionSchema, applySuppressions, hashTarget } from "./suppress";
import { FindingSchema, toSarif } from "./sarif";

const findings = [
  { ruleId: "label", message: "Form elements must have labels.", target: ["input[name=email]"] },
  { ruleId: "color-contrast", message: "Text must have sufficient contrast.", target: [".bad"] },
].map((f) => FindingSchema.parse(f));

const suppressions = [
  {
    ruleId: "color-contrast",
    targetHash: hashTarget([".bad"]),
    reason: "Legacy theme migration in progress; tracked in ENG-1234",
    expiresAt: "2026-06-30",
  },
].map((s) => SuppressionSchema.parse(s));

const { kept, suppressed } = applySuppressions({ findings, suppressions });
console.log("Suppressed:", suppressed);

const sarif = toSarif({ toolName: "a11y-audit", findings: kept });
console.log(JSON.stringify(sarif, null, 2));

