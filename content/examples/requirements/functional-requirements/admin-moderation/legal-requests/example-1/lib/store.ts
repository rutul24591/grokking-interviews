const legalRequestState = {
  counselOwner: "policy-counsel-apac",
  requests: [
    { id: "lr-12", requester: "DPA request 12", region: "EU", priority: "urgent" as const, status: "counsel-review" as const },
    { id: "lr-19", requester: "Copyright notice 19", region: "US", priority: "standard" as const, status: "intake" as const }
  ],
  lastMessage: "Legal requests should expose owner, jurisdiction, and fulfillment status so admin teams do not lose statutory deadlines."
};

export function snapshot() {
  return structuredClone(legalRequestState);
}

export function mutate(type: "assign-counsel" | "mark-fulfilled", id?: string) {
  if (type === "assign-counsel") {
    legalRequestState.counselOwner = legalRequestState.counselOwner === "policy-counsel-apac" ? "trust-counsel-emea" : "policy-counsel-apac";
    legalRequestState.lastMessage = `Rotated legal review ownership to ${legalRequestState.counselOwner}.`;
    return snapshot();
  }

  if (type === "mark-fulfilled" && id) {
    legalRequestState.requests = legalRequestState.requests.map((request) =>
      request.id === id ? { ...request, status: "fulfilled" as const } : request
    );
    legalRequestState.lastMessage = `Marked ${id} as fulfilled and ready for evidence retention.`;
  }

  return snapshot();
}
