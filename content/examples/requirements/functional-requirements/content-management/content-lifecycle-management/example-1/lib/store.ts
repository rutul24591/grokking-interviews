export type LifecycleEntry = {
  id: string;
  title: string;
  stage: "draft" | "review" | "published" | "archived";
  owner: string;
  nextAction: string;
};

export const lifecycleState = {
  entries: [
    { id: "c1", title: "HTTP/3", stage: "draft" as const, owner: "platform-team", nextAction: "submit-for-review" },
    { id: "c2", title: "OAuth Providers", stage: "review" as const, owner: "security-team", nextAction: "approve-or-reject" },
    { id: "c3", title: "Monorepos", stage: "published" as const, owner: "frontend-architecture", nextAction: "observe-metrics" }
  ],
  lastMessage: "Lifecycle management prevents content from jumping directly to publish without review, governance, and retirement visibility."
};
