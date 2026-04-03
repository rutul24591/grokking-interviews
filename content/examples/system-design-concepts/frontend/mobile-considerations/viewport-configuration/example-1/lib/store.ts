export const viewportConfigs = [
  {
    id: "accessible-form",
    label: "Accessible form page",
    width: "device-width",
    initialScale: 1,
    userScalable: true,
    safeAreaAware: true,
    fixedHeader: true,
    formHeavy: true
  },
  {
    id: "media-shell",
    label: "Media-heavy shell",
    width: "device-width",
    initialScale: 1,
    userScalable: true,
    safeAreaAware: false,
    fixedHeader: true,
    formHeavy: false
  },
  {
    id: "legacy-locked-zoom",
    label: "Legacy locked zoom",
    width: "device-width",
    initialScale: 1,
    userScalable: false,
    safeAreaAware: false,
    fixedHeader: false,
    formHeavy: true
  }
] as const;

export const viewportRules = [
  "Keep device-width as the baseline width directive for mobile-first layouts.",
  "Never disable zoom on form-heavy or dense reading surfaces.",
  "Honor safe-area insets before shipping to notched devices.",
  "Audit sticky headers and overlays against the visual viewport, not only the layout viewport."
];

export const viewportPlaybook = [
  { issue: "Zoom disabled", action: "Restore user scaling and verify text remains readable during form entry." },
  { issue: "Safe area ignored", action: "Apply inset-aware padding to headers, bottom bars, and floating CTAs." },
  { issue: "Visual viewport overlap", action: "Adjust sticky elements when the keyboard opens on mobile browsers." }
];
