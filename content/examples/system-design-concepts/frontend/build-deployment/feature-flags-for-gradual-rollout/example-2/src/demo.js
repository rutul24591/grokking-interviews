function evaluateFlagExpansion(flag) {
  const actions = [];

  if (!flag.ownerPresent) actions.push("restore-flag-owner");
  if (!flag.targetingValidated) actions.push("repair-targeting-rules");
  if (!flag.killSwitchCoversWrites) actions.push("extend-kill-switch-to-side-effects");
  if (flag.metricRegressionPct >= 1.5) actions.push("pause-or-disable-flag");

  return {
    id: flag.id,
    expand: actions.length === 0,
    actions
  };
}

const flags = [
  { id: "healthy", ownerPresent: true, targetingValidated: true, killSwitchCoversWrites: true, metricRegressionPct: 0.3 },
  { id: "audience-leak", ownerPresent: true, targetingValidated: false, killSwitchCoversWrites: true, metricRegressionPct: 0.4 },
  { id: "unsafe-rollback", ownerPresent: false, targetingValidated: true, killSwitchCoversWrites: false, metricRegressionPct: 2.2 }
];

console.log(flags.map(evaluateFlagExpansion));
