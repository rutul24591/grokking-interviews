function planPaymentRequestHandoff(flow) {
  const actions = [];
  if (!flow.supported || !flow.canMakePayment) actions.push("use-standard-checkout");
  if (flow.dynamicTotals) actions.push("freeze-confirm-until-totals-final");
  if (!flow.fallbackKeepsCartState) actions.push("repair-fallback-cart-preservation");
  return {
    id: flow.id,
    actions,
    entryLane: flow.supported && flow.canMakePayment ? "payment-request" : "standard-checkout",
    shipReady: !actions.includes("repair-fallback-cart-preservation")
  };
}

const flows = [
  { id: "wallet", supported: true, canMakePayment: true, dynamicTotals: false, fallbackKeepsCartState: true },
  { id: "dynamic", supported: true, canMakePayment: true, dynamicTotals: true, fallbackKeepsCartState: true },
  { id: "unsupported", supported: false, canMakePayment: false, dynamicTotals: false, fallbackKeepsCartState: false }
];

console.log(flows.map(planPaymentRequestHandoff));
