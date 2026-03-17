const flags = require('./flags.json');
function isEnabled(flag, userId) {
  const cfg = flags[flag];
  if (!cfg) return false;
  return (userId % 100) / 100 < cfg.rollout;
}
module.exports = { isEnabled };