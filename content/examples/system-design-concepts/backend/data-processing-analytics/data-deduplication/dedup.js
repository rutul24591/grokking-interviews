const seen = new Set();
function accept(evt) {
  if (seen.has(evt.id)) return false;
  seen.add(evt.id);
  return true;
}
module.exports = { accept };