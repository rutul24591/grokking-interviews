function callbackChurn(previous, next, dependenciesChanged) {
  return {
    stable: previous === next,
    avoidable: previous !== next && !dependenciesChanged
  };
}

const stable = () => "same";
console.log(callbackChurn(stable, stable, false));
console.log(callbackChurn(() => "a", () => "a", false));
console.log(callbackChurn(() => "a", () => "b", true));
