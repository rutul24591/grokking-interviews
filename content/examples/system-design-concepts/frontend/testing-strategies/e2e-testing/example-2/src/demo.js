function evaluateE2EJourney(flow) {
  const actions = [];

  if (!flow.realEmailStep) actions.push("cover-email-or-activation-step");
  if (!flow.externalServicesMirrored) actions.push("raise-environment-fidelity");
  if (!flow.retryAndResumeCovered) actions.push("cover-retry-and-resume-behavior");
  if (!flow.seededDataStable) actions.push("stabilize-test-data-seeding");
  if (!flow.asyncCompletionAsserted) actions.push("wait-for-real-completion-not-just-ui-transition");

  const lane = actions.length === 0 ? "ready" : actions.length <= 2 ? "watch" : "block";
  return { id: flow.id, lane, actions, ready: actions.length === 0 };
}

const journeys = [
  { id: "checkout", realEmailStep: true, externalServicesMirrored: true, retryAndResumeCovered: true, seededDataStable: true, asyncCompletionAsserted: true },
  { id: "onboarding", realEmailStep: false, externalServicesMirrored: true, retryAndResumeCovered: false, seededDataStable: true, asyncCompletionAsserted: true },
  { id: "renewal", realEmailStep: true, externalServicesMirrored: false, retryAndResumeCovered: false, seededDataStable: false, asyncCompletionAsserted: false }
];

console.log(journeys.map(evaluateE2EJourney));
