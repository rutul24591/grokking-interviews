const zlib = require('zlib');

function compress(data) {
  return zlib.gzipSync(Buffer.from(data));
}

module.exports = { compress };