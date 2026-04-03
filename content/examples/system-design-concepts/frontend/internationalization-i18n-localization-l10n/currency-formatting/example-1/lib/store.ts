export const currencyCatalog = [
  { locale: "en-US", currency: "USD", amount: 1299.5, product: "Enterprise seat pack" },
  { locale: "de-DE", currency: "EUR", amount: 1199.5, product: "Marketplace bundle" },
  { locale: "ja-JP", currency: "JPY", amount: 180000, product: "Annual platform contract" }
];

export const currencyPolicies = [
  "Display ISO currency when the symbol is ambiguous.",
  "Keep billing currency fixed even if the browsing locale changes.",
  "Surface rounding warnings when the checkout currency differs from settlement currency."
];
