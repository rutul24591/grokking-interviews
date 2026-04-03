export const languageViews = [
  { locale: "en", coverage: 100, articleTitle: "Checkout incident review" },
  { locale: "fr", coverage: 92, articleTitle: "Revue d'incident de paiement" },
  { locale: "ar", coverage: 78, articleTitle: "مراجعة حادث الدفع" }
];

export const languagePolicies = [
  "Keep navigation labels translated before exposing a locale switch publicly.",
  "Do not link to untranslated article routes without a fallback banner.",
  "Persist language choice across article and example tabs."
];
