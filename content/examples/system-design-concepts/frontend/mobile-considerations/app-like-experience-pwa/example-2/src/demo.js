function evaluateInstallProgram(session) {
  const showPrompt = session.engagedTasks >= 2 && session.installable && session.shellHealth === "healthy" && !session.installed;
  const syncMode = session.offlineQueueDepth > 3 ? "throttle-background-sync" : session.offlineQueueDepth > 0 ? "normal-background-sync" : "idle";
  return {
    id: session.id,
    showPrompt,
    syncMode,
    followUp: !session.installable
      ? "fix-installability"
      : session.shellHealth !== "healthy"
        ? "repair-shell"
        : session.pushEligible && session.installed
          ? "offer-push-onboarding"
          : "continue-reading"
  };
}

const scenarios = [
  { id: "ready-reader", engagedTasks: 4, installable: true, shellHealth: "healthy", installed: false, offlineQueueDepth: 1, pushEligible: true },
  { id: "cold-visit", engagedTasks: 1, installable: false, shellHealth: "warming", installed: false, offlineQueueDepth: 0, pushEligible: false },
  { id: "queued-commuter", engagedTasks: 5, installable: true, shellHealth: "healthy", installed: true, offlineQueueDepth: 5, pushEligible: true }
];

console.log(scenarios.map(evaluateInstallProgram));
