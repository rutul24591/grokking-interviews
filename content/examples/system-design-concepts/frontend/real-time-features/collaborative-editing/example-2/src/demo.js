function chooseCollaborationPlan(session) {
  const publishBlocked = session.pendingOps > 0 || session.syncHealth === "diverged";
  const cursorMode = session.presence > 3 ? "cluster-remote-cursors" : "show-all-remote-cursors";
  const repairLane = session.syncHealth === "diverged" || session.conflicts > 0;
  return {
    id: session.id,
    publishBlocked,
    cursorMode,
    repairLane,
    followUp: session.syncHealth === "lagging" ? "show-pending-ops-tray" : session.syncHealth === "diverged" ? "enter-merge-repair" : "healthy"
  };
}

const sessions = [
  { id: "healthy", pendingOps: 1, syncHealth: "healthy", presence: 2, conflicts: 0 },
  { id: "lagging", pendingOps: 5, syncHealth: "lagging", presence: 4, conflicts: 1 },
  { id: "diverged", pendingOps: 7, syncHealth: "diverged", presence: 3, conflicts: 3 }
];

const plans = sessions.map(chooseCollaborationPlan);
console.log(plans);
console.log({
  blockedPublishes: plans.filter((plan) => plan.publishBlocked).length,
  repairLanes: plans.filter((plan) => plan.repairLane).length
});
