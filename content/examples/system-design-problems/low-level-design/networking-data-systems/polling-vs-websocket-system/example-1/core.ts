export type Transport = "poll" | "ws";

export type Policy = {
  supportsWebSocket: boolean;
  batterySaver: boolean;
  needsRealtime: boolean;
  networkQuality: "good" | "poor";
};

export function chooseTransport(p: Policy): Transport {
  if (!p.needsRealtime) return "poll";
  if (!p.supportsWebSocket) return "poll";
  if (p.batterySaver && p.networkQuality === "poor") return "poll";
  return "ws";
}
