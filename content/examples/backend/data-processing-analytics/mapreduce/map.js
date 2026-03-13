function map(text) {
  return text.split(/s+/).map(w => [w, 1]);
}
module.exports = { map };