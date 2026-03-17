const policy = require('./policy.json');

function authorize(user, action) {
  const allowed = policy.roles[user.role] || [];
  if (!allowed.includes(action)) throw new Error('forbidden');
}

module.exports = { authorize };