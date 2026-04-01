export type ShareChannel = {
  id: string;
  channel: "link" | "email" | "social" | "embed";
  audience: string;
  status: "ready" | "rate-limited" | "warning";
};
export const sharingState = {
  primaryAudience: "engineering-leads",
  channels: [
    { id: "sh1", channel: "link" as const, audience: "engineering-leads", status: "ready" as const },
    { id: "sh2", channel: "email" as const, audience: "newsletter", status: "warning" as const },
    { id: "sh3", channel: "social" as const, audience: "linkedin", status: "rate-limited" as const }
  ],
  lastMessage: "Sharing interfaces need explicit channel status so authors know whether a share path is ready, degraded, or blocked."
};
