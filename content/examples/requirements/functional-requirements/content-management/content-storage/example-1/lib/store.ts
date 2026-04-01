export type StorageClass = {
  id: string;
  contentType: string;
  tier: "hot" | "warm" | "cold";
  retentionDays: number;
  encryption: "managed" | "customer-key";
  recoverySla: string;
};

export const storageState = {
  defaultTier: "hot",
  complianceBlocked: false,
  classes: [
    { id: "st1", contentType: "article-body", tier: "hot" as const, retentionDays: 3650, encryption: "managed" as const, recoverySla: "instant" },
    { id: "st2", contentType: "draft-history", tier: "warm" as const, retentionDays: 180, encryption: "managed" as const, recoverySla: "15 minutes" },
    { id: "st3", contentType: "deleted-media", tier: "cold" as const, retentionDays: 30, encryption: "customer-key" as const, recoverySla: "4 hours" }
  ],
  lastMessage: "Storage policy should follow retention, access frequency, encryption requirements, and recovery objectives."
};
