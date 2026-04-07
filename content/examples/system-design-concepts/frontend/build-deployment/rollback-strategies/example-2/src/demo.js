function chooseRollbackLane(input) {
  const actions = [];

  if (!input.previousArtifactReady) actions.push("restore-last-known-good-artifact");
  if (!input.sessionCompatible) actions.push("prepare-session-compatibility-shim");
  if (input.cacheTtlMinutes > 15) actions.push("sequence-cache-invalidation");
  if (input.backendContractChanged) actions.push("verify-old-frontend-against-current-api");

  return { id: input.id, lane: actions.length === 0 ? "rollback-now" : "repair-before-rollback", actions };
}

const cases = [
  { id: "simple-asset-revert", previousArtifactReady: true, sessionCompatible: true, cacheTtlMinutes: 5, backendContractChanged: false },
  { id: "session-risk", previousArtifactReady: true, sessionCompatible: false, cacheTtlMinutes: 10, backendContractChanged: false },
  { id: "full-stack-drift", previousArtifactReady: false, sessionCompatible: true, cacheTtlMinutes: 30, backendContractChanged: true }
];

console.log(cases.map(chooseRollbackLane));
