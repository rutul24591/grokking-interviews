function promptForMfa({ deviceRisk, locationRisk, hasMfa }) {
  return !hasMfa ? "require-setup" : deviceRisk || locationRisk ? "step-up" : "allow";
}

console.log(promptForMfa({ deviceRisk: false, locationRisk: false, hasMfa: true }));
console.log(promptForMfa({ deviceRisk: true, locationRisk: false, hasMfa: true }));
