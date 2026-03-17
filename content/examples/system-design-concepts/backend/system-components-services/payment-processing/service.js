const processed = new Set();
function charge(id, amount) {
  if (processed.has(id)) return { status: 'duplicate' };
  processed.add(id);
  return { status: 'charged', amount };
}
module.exports = { charge };