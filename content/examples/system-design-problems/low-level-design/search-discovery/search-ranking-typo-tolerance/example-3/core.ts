export interface QueryPolicy {
  locale: string;
  maxCandidates: number;
  maxEdits: number;
  sensitivePattern: RegExp;
}

export function chooseTypoPolicy(query: string, policy: QueryPolicy) {
  const normalized = query.trim().toLocaleLowerCase(policy.locale);
  if (!normalized) return { mode: "reject" as const, reason: "empty-query" };
  if (normalized.length > 120) return { mode: "reject" as const, reason: "query-too-long" };
  if (policy.sensitivePattern.test(normalized)) {
    return { mode: "exact-only" as const, normalized, maxCandidates: Math.min(policy.maxCandidates, 20) };
  }
  const editBudget = normalized.length <= 4 ? Math.min(1, policy.maxEdits) : policy.maxEdits;
  return { mode: "staged-fuzzy" as const, normalized, editBudget, maxCandidates: policy.maxCandidates };
}

export function runPolicyScenario() {
  const policy = { locale: "en-US", maxCandidates: 80, maxEdits: 2, sensitivePattern: /^(acct|rx|sku)-\d+$/ };
  return {
    shortBrand: chooseTypoPolicy("apl", policy),
    account: chooseTypoPolicy("acct-12345", policy),
    pathological: chooseTypoPolicy("x".repeat(121), policy),
  };
}
