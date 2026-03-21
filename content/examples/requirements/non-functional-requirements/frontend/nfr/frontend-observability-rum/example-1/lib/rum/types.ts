export type RumEventType = "web_vital" | "error" | "route" | "custom";

export type RumEvent = {
  id: string;
  ts: number;
  sessionId: string;
  page: string;
  type: RumEventType;
  name: string;
  value?: number;
  unit?: "ms" | "score" | "count" | "bytes";
  tags?: Record<string, string>;
};

export type RumIngestEnvelope = {
  app: string;
  version: string;
  events: RumEvent[];
};

