function driftStatus(controlledValue, domValue) {
  return { drifted: controlledValue !== domValue, controlledValue, domValue };
}

console.log(driftStatus("SSR", "SSR"));
console.log(driftStatus("SSR", "CSR"));
