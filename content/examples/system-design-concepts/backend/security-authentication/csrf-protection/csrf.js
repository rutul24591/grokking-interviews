const crypto = require('crypto');

function token() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = { token };