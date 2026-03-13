const zlib = require('zlib');

function decompress(buf) {
  return zlib.gunzipSync(buf).toString('utf8');
}

module.exports = { decompress };