const jwt = require('jsonwebtoken');
const secret = 'secret123';

function issue(userId) {
  return jwt.sign({ sub: userId, role: 'user' }, secret, { expiresIn: 3600 });
}

module.exports = { issue };