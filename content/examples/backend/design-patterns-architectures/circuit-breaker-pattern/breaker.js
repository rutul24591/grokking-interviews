let failures = 0;
let open = false;
function call(fn) {
  if (open) throw new Error('open');
  try { return fn(); } catch {
    failures += 1;
    if (failures > 3) open = true;
  }
}
module.exports = { call };