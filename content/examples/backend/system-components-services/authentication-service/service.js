const crypto = require('crypto');
const users = new Map([['u1', { id: 'u1', password: 'secret' }]]);

function issueToken(userId) {
  return crypto.createHmac('sha256', 'auth-secret').update(userId + Date.now()).digest('hex');
}

function login(userId, password) {
  const user = users.get(userId);
  if (!user || user.password != password) return null;
  return { token: issueToken(userId) };
}

module.exports = { login };