export type SessionRecord = {
  sessionId: string;
  device: string;
  createdAt: string;
  expiresAt: string;
  risk: "low" | "medium" | "high";
};

export const sessionState = {
  active: [
    {
      sessionId: "sess-web-001",
      device: "Chrome on macOS",
      createdAt: "2026-04-01T08:00:00Z",
      expiresAt: "2026-04-01T16:00:00Z",
      risk: "low"
    }
  ] satisfies SessionRecord[],
  rotationCount: 0,
  lastMessage: "Session inventory loaded."
};
