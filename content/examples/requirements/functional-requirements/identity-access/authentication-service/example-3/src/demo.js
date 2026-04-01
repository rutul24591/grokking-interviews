function authOutcome({ credentialsValid, accountDisabled, stepUpRequired }) {
  if (!credentialsValid) return { state: 'reject', nextAction: 'retry-login' };
  if (accountDisabled) return { state: 'blocked', nextAction: 'contact-support' };
  if (stepUpRequired) return { state: 'challenge', nextAction: 'complete-step-up' };
  return { state: 'authenticated', nextAction: 'issue-session' };
}

console.log(authOutcome({ credentialsValid: true, accountDisabled: false, stepUpRequired: true }));
console.log(authOutcome({ credentialsValid: true, accountDisabled: true, stepUpRequired: false }));
