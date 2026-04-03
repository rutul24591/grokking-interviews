export const formattingSamples = [
  { locale: "en-US", timezone: "America/New_York", date: "2026-04-02T18:30:00Z", metric: 1234567.89, surface: "audit" },
  { locale: "fr-FR", timezone: "Europe/Paris", date: "2026-04-02T18:30:00Z", metric: 1234567.89, surface: "dashboard" },
  { locale: "ar-EG", timezone: "Africa/Cairo", date: "2026-04-02T18:30:00Z", metric: 1234567.89, surface: "incident" }
];

export const formattingNotes = [
  "Display user timezone explicitly when operational events are time-sensitive.",
  "Do not mix server timezone and browser locale in the same view without a label.",
  "Compact number formats should not be used where precision changes decisions.",
  "Operational audit surfaces need both localized labels and raw timestamps."
];

export const formattingPanels = [
  "Rendered timestamp",
  "Raw UTC timestamp",
  "Localized metric display",
  "Precision and timezone warnings"
];
