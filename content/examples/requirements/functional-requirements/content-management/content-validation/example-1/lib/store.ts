export type ValidationCheck = {
  id: string;
  rule: string;
  result: "pass" | "warning" | "fail";
  impact: "metadata" | "content" | "policy";
};
export const validationState = {
  targetContent: "Streaming SSR",
  checks: [
    { id: "v1", rule: "hero-image-present", result: "pass" as const, impact: "metadata" as const },
    { id: "v2", rule: "summary-length", result: "warning" as const, impact: "content" as const },
    { id: "v3", rule: "restricted-claim-scan", result: "fail" as const, impact: "policy" as const }
  ],
  lastMessage: "Validation should catch metadata gaps, weak content signals, and policy issues before the author can publish."
};
