function partialLogout({ localCleared, otherActiveSessions, idpSessionActive }) {
  if (!localCleared) return "retry-local-cleanup";
  if (idpSessionActive) return "trigger-idp-logout";
  if (otherActiveSessions > 0) return "offer-global-sign-out";
  return "complete";
}

console.log(partialLogout({ localCleared: true, otherActiveSessions: 2, idpSessionActive: false }));
console.log(partialLogout({ localCleared: true, otherActiveSessions: 0, idpSessionActive: true }));
