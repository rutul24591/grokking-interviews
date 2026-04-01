function validateCallback({ expectedState, actualState, expectedRedirect, actualRedirect }) {
  return {
    stateValid: expectedState === actualState,
    redirectValid: expectedRedirect === actualRedirect,
    accepted: expectedState === actualState && expectedRedirect === actualRedirect
  };
}

console.log(
  validateCallback({
    expectedState: "state-1",
    actualState: "state-1",
    expectedRedirect: "/auth/callback",
    actualRedirect: "/auth/callback"
  })
);
console.log(
  validateCallback({
    expectedState: "state-1",
    actualState: "state-2",
    expectedRedirect: "/auth/callback",
    actualRedirect: "/malicious"
  })
);
