const speakeasy = require('speakeasy');

function verifyToken(secret, token) {
  return speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });
}

module.exports = { verifyToken };