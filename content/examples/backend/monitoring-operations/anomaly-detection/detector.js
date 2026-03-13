const base = require('./baseline.json');
function anomaly(current) {
  return current > base.errorRate * 3;
}
module.exports = { anomaly };