function evaluateIntegrationPlan(flow) {
  const actions = [];

  if (!flow.realApiContract) actions.push("replace-stubs-with-contract-backed-responses");
  if (!flow.authStateCovered) actions.push("cover-session-and-auth-boundary");
  if (!flow.asyncCallbacksCovered) actions.push("exercise-queued-or-callback-state-changes");
  if (!flow.previewMatchesCi) actions.push("align-preview-and-ci-environments");
  if (!flow.stateTransitionAssertionsStrong) actions.push("assert-intermediate-not-just-final-states");

  const lane = actions.length === 0 ? "ready" : actions.length <= 2 ? "watch" : "block";
  return { id: flow.id, lane, actions, ready: actions.length === 0 };
}

const flows = [
  { id: "checkout", realApiContract: true, authStateCovered: true, asyncCallbacksCovered: true, previewMatchesCi: true, stateTransitionAssertionsStrong: true },
  { id: "search", realApiContract: false, authStateCovered: true, asyncCallbacksCovered: false, previewMatchesCi: true, stateTransitionAssertionsStrong: false },
  { id: "upload", realApiContract: true, authStateCovered: false, asyncCallbacksCovered: false, previewMatchesCi: false, stateTransitionAssertionsStrong: false }
];

console.log(flows.map(evaluateIntegrationPlan));
