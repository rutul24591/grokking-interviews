// Compression utilities for gzip and Brotli.

const zlib = require("zlib");

function gzip(buffer) {
  return zlib.gzipSync(buffer);
}

function brotli(buffer) {
  return zlib.brotliCompressSync(buffer, {
    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 },
  });
}

module.exports = { gzip, brotli };
