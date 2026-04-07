function detectPaymentRequestFailureRisk(state) {
  const blockers = [];
  if (state.walletShownWhenUnsupported) blockers.push("wallet-entry-visible-on-unsupported-browser");
  if (state.confirmAllowedBeforeTotalsFinal) blockers.push("checkout-confirmed-before-totals-final");
  if (!state.cartStatePreservedOnFallback) blockers.push("cart-lost-during-fallback");
  if (state.walletFailureHidden) blockers.push("wallet-failure-not-explained");
  return { id: state.id, healthy: blockers.length === 0, blockers, repair: blockers[0] ?? "healthy" };
}

const states = [
  { id: "healthy", walletShownWhenUnsupported: false, confirmAllowedBeforeTotalsFinal: false, cartStatePreservedOnFallback: true, walletFailureHidden: false },
  { id: "broken", walletShownWhenUnsupported: true, confirmAllowedBeforeTotalsFinal: true, cartStatePreservedOnFallback: false, walletFailureHidden: true }
];

console.log(states.map(detectPaymentRequestFailureRisk));
