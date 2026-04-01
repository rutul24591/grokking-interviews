function resolveVerificationState({ status, expired }) {
  if (status === "verified") return { screen: "already-verified", nextAction: "continue-to-app" };
  if (expired) return { screen: "expired", nextAction: "resend-link" };
  return { screen: "pending", nextAction: "enter-token" };
}

console.log(resolveVerificationState({ status: "verified", expired: false }));
console.log(resolveVerificationState({ status: "pending", expired: true }));
