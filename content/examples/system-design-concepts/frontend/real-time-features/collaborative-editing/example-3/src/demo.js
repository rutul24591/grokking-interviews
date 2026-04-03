function detectCollaborationRisk(state) {
  const blockers = [];
  if (state.syncHealth === "diverged" && !state.mergeLaneVisible) blockers.push("divergence-hidden-from-user");
  if (state.pendingOps > 0 && state.publishAllowed) blockers.push("publish-before-acknowledgement");
  if (state.staleCursorMinutes > 2 && !state.staleIndicatorVisible) blockers.push("stale-presence-hidden");
  if (state.conflicts > 0 && !state.conflictOwnerVisible) blockers.push("conflict-ownership-hidden");
  return {
    id: state.id,
    healthy: blockers.length === 0,
    blockers,
    repair: blockers.includes("conflict-ownership-hidden") ? "show-conflict-ownership" : blockers[0] ?? "healthy"
  };
}

const states = [
  { id: "healthy", syncHealth: "healthy", mergeLaneVisible: true, pendingOps: 0, publishAllowed: false, staleCursorMinutes: 0, staleIndicatorVisible: true, conflicts: 0, conflictOwnerVisible: true },
  { id: "broken", syncHealth: "diverged", mergeLaneVisible: false, pendingOps: 3, publishAllowed: true, staleCursorMinutes: 6, staleIndicatorVisible: false, conflicts: 2, conflictOwnerVisible: false }
];

const audits = states.map(detectCollaborationRisk);
console.log(audits);
console.log({ unhealthySessions: audits.filter((item) => !item.healthy).map((item) => item.id) });
