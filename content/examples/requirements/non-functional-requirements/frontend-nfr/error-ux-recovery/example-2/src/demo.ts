type FailureState = { screen: string; retryable: boolean; destructiveAction: boolean; unsavedWork: boolean };

function chooseUxRecovery(state: FailureState) {
  if (!state.retryable) return { ...state, pattern: 'show-support-path' };
  if (state.unsavedWork) return { ...state, pattern: 'save-draft-then-retry' };
  if (state.destructiveAction) return { ...state, pattern: 'ask-confirmation-before-retry' };
  return { ...state, pattern: 'inline-retry' };
}

const decisions = [
  { screen: 'editor', retryable: true, destructiveAction: false, unsavedWork: true },
  { screen: 'delete-account', retryable: true, destructiveAction: true, unsavedWork: false },
  { screen: 'billing', retryable: false, destructiveAction: false, unsavedWork: false },
].map(chooseUxRecovery);

console.table(decisions);
if (decisions[0].pattern !== 'save-draft-then-retry') throw new Error('Editor should preserve work before retry');
