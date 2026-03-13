const fs = require('fs');
const crypto = require('crypto');

function verify(path) {
  const data = fs.readFileSync(path);
  const expected = fs.readFileSync(path + '.sha', 'utf8');
  const actual = crypto.createHash('sha256').update(data).digest('hex');
  if (expected !== actual) throw new Error('checksum mismatch');
  return data;
}

module.exports = { verify };