const crypto = require('crypto');

function decrypt(payload, key) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, payload.iv);
  decipher.setAuthTag(payload.tag);
  return Buffer.concat([decipher.update(payload.enc), decipher.final()]);
}

module.exports = { decrypt };