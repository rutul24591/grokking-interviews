function resetOutcome({ tokenValid, passwordStrong, alreadyConsumed }) {
  if (alreadyConsumed) return "reject-replay";
  if (!tokenValid) return "reject-token";
  if (!passwordStrong) return "reject-password";
  return "commit-reset";
}

console.log(resetOutcome({ tokenValid: true, passwordStrong: false, alreadyConsumed: false }));
console.log(resetOutcome({ tokenValid: true, passwordStrong: true, alreadyConsumed: true }));
