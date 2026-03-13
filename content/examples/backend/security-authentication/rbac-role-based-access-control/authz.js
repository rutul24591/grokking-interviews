const roles = require('./roles.json');

function can(role, action) {
  return (roles[role] || []).includes(action);
}

module.exports = { can };