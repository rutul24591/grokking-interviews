function chooseCurrencyPresentationScenario(scenario) {
  return {
    scenario: scenario.name,
    showIsoCode: scenario.ambiguousSymbol || scenario.billingCurrency !== scenario.settlementCurrency,
    preserveBillingCurrency: true,
    addConversionNotice: scenario.billingCurrency !== scenario.settlementCurrency,
    useLocaleSeparatorsOnly: scenario.browseLocale !== scenario.productLocale
  };
}

console.log([
  { name: "same-currency-same-locale", browseLocale: "en-US", productLocale: "en-US", billingCurrency: "USD", settlementCurrency: "USD", ambiguousSymbol: false },
  { name: "different-locale-same-currency", browseLocale: "de-DE", productLocale: "en-US", billingCurrency: "USD", settlementCurrency: "USD", ambiguousSymbol: false },
  { name: "different-settlement", browseLocale: "en-AU", productLocale: "en-US", billingCurrency: "USD", settlementCurrency: "EUR", ambiguousSymbol: true }
].map(chooseCurrencyPresentationScenario));
