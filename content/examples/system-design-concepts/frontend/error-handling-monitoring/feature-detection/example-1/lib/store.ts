export type FeatureFlag = {
  id: string;
  label: string;
  supported: boolean;
  fallback: string;
  required: boolean;
  affectedSurface: string;
};
export const featureState = {
  features: [
    {
      id: "intersection-observer",
      label: "Intersection Observer",
      supported: true,
      fallback: "manual-pagination",
      required: false,
      affectedSurface: "infinite recommendations"
    },
    {
      id: "clipboard",
      label: "Clipboard API",
      supported: false,
      fallback: "select-and-copy-ui",
      required: false,
      affectedSurface: "share panel"
    },
    {
      id: "history-api",
      label: "History API",
      supported: true,
      fallback: "full-page-navigation",
      required: true,
      affectedSurface: "article navigation"
    }
  ],
  browserProfile: "mid-tier mobile browser",
  releaseChannel: "2026.04.frontend",
  lastMessage:
    "Feature detection chooses capability-specific fallbacks instead of assuming every browser supports the same APIs."
};
