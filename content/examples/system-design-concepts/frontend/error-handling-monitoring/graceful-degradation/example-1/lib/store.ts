export type Capability = {
  id: string;
  feature: string;
  mode: "full" | "degraded";
  fallbackUi: string;
  critical: boolean;
  journey: string;
};
export const degradationState = {
  capabilities: [
    {
      id: "cap1",
      feature: "live-comments",
      mode: "full" as const,
      fallbackUi: "polling-comments",
      critical: false,
      journey: "engagement"
    },
    {
      id: "cap2",
      feature: "share-preview",
      mode: "degraded" as const,
      fallbackUi: "copy-link",
      critical: true,
      journey: "sharing"
    },
    {
      id: "cap3",
      feature: "offline-cache",
      mode: "full" as const,
      fallbackUi: "network-only",
      critical: true,
      journey: "reading"
    }
  ],
  degradedBanner: "localized",
  lastMessage: "Graceful degradation keeps core reading flows available when advanced capabilities fail."
};
