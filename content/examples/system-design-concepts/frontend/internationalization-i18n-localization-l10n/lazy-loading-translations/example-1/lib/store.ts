export const translationBundles = [
  { locale: "en", section: "checkout", status: "loaded", keys: 84 },
  { locale: "fr", section: "checkout", status: "loading", keys: 84 },
  { locale: "ar", section: "support", status: "idle", keys: 62 }
];

export const bundlePolicies = [
  "Preload the default locale for the next critical route.",
  "Show namespace fallback instead of blank UI while a bundle loads.",
  "Record missing bundle errors separately from missing translation keys."
];
