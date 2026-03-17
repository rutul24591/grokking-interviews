const budget = require('./budget.json');
function canDeploy() {
  return budget.consumed < budget.budget;
}
module.exports = { canDeploy };