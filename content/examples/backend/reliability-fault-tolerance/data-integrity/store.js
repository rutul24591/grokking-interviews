const crypto = require('crypto');
const fs = require('fs');

function hash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function writeFile(path, data) {
  const checksum = hash(data);
  fs.writeFileSync(path, data);
  fs.writeFileSync(path + '.sha', checksum);
}

module.exports = { writeFile };