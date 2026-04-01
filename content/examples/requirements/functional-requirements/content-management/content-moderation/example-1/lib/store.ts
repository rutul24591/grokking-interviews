export type ModerationCase = {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  queue: "spam" | "abuse" | "policy";
  decision: "pending" | "approve" | "reject" | "escalate";
};

export const moderationState = {
  cases: [
    { id: "m1", title: "Comment spam burst", severity: "medium" as const, queue: "spam" as const, decision: "pending" as const },
    { id: "m2", title: "Offensive user bio", severity: "high" as const, queue: "abuse" as const, decision: "escalate" as const },
    { id: "m3", title: "Suspected duplicate article", severity: "low" as const, queue: "policy" as const, decision: "pending" as const }
  ],
  lastMessage: "Moderation systems need visible queue ownership, severity, and decision rationale before content is approved or removed."
};
