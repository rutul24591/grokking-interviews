const jwt = require('jsonwebtoken');
const secret = 'secret123';

function verify(token) {
  return jwt.verify(token, secret);
}

module.exports = { verify };