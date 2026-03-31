for (const settlement of [
  { gatewayStatus: "authorized", localState: "pending confirmation" },
  { gatewayStatus: "paid", localState: "activate subscription" },
  { gatewayStatus: "failed", localState: "show retry payment CTA" }
]) {
  console.log(`${settlement.gatewayStatus} -> ${settlement.localState}`);
}
