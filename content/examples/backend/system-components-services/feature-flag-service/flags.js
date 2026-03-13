const flags = { newCheckout: { enabled: true, rollout: 0.3 } };
function enabled(flag, userId) {
  const cfg = flags[flag];
  if (!cfg) return false;
  return (userId % 100) / 100 < cfg.rollout;
}
module.exports = { enabled };