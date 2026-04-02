const abuseState = {
  threshold: 72,
  cases: [
    { id: "ab-1", actor: "user-449", signal: "report-spike", riskScore: 84, status: "queued" as const },
    { id: "ab-2", actor: "account-118", signal: "bot-pattern", riskScore: 91, status: "reviewing" as const }
  ],
  lastMessage: "Detection consoles should show risk scores and escalation actions instead of hiding abuse model outputs behind batch jobs."
};

export function snapshot() {
  return structuredClone(abuseState);
}

export function mutate(type: "raise-threshold" | "escalate", caseId?: string) {
  if (type === "raise-threshold") {
    abuseState.threshold += 3;
    abuseState.lastMessage = `Raised threshold to ${abuseState.threshold} to reduce noisy abuse alerts.`;
    return snapshot();
  }

  if (type === "escalate" && caseId) {
    abuseState.cases = abuseState.cases.map((entry) => entry.id === caseId ? { ...entry, status: "escalated" } : entry);
    abuseState.lastMessage = `Escalated ${caseId} into senior moderation review.`;
  }

  return snapshot();
}
