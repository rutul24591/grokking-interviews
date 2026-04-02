function validateTransitions(cases) {
  const allowed = {
    created: ["authorized"],
    authorized: ["captured", "voided"],
    captured: ["refunded"],
    refunded: [],
    voided: []
  };

  const analysis = cases.map((entry) => ({
    id: entry.id,
    allowed: allowed[entry.current].includes(entry.next),
    requireSideEffectGuard: !allowed[entry.current].includes(entry.next),
    reason: allowed[entry.current].includes(entry.next) ? "valid-transition" : `invalid-from-${entry.current}`
  }));

  return {
    analysis,
    invalidTransitions: analysis.filter((entry) => !entry.allowed).map((entry) => entry.id)
  };
}

console.log(JSON.stringify(validateTransitions([
  { id: "tx-1", current: "created", next: "authorized" },
  { id: "tx-2", current: "captured", next: "authorized" },
  { id: "tx-3", current: "authorized", next: "voided" }
]), null, 2));
