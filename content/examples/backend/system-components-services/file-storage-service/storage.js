const files = new Map();
function put(key, data) { files.set(key, data); }
function get(key) { return files.get(key); }
module.exports = { put, get };