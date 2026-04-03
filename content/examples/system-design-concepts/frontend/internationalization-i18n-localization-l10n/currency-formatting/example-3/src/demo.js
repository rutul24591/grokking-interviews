function detectCurrencyFormattingRisk({ displayCurrency, settlementCurrency, roundedDisplay, minorUnitMismatch, missingConversionRate }) {
  return {
    requiresDisclosure: displayCurrency !== settlementCurrency || roundedDisplay || minorUnitMismatch || missingConversionRate,
    reason: displayCurrency !== settlementCurrency
      ? "display-settlement-mismatch"
      : roundedDisplay
        ? "rounded-display-risk"
        : minorUnitMismatch
          ? "minor-unit-mismatch"
          : missingConversionRate
            ? "missing-conversion-rate"
            : "aligned"
  };
}

console.log([
  { displayCurrency: "JPY", settlementCurrency: "USD", roundedDisplay: false, minorUnitMismatch: false, missingConversionRate: false },
  { displayCurrency: "EUR", settlementCurrency: "EUR", roundedDisplay: true, minorUnitMismatch: false, missingConversionRate: false },
  { displayCurrency: "USD", settlementCurrency: "CAD", roundedDisplay: false, minorUnitMismatch: false, missingConversionRate: true }
].map(detectCurrencyFormattingRisk));
