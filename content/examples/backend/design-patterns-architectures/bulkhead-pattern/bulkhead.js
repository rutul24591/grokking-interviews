let inFlight = 0;
const limit = 5;
function acquire() {
  if (inFlight >= limit) return false;
  inFlight += 1;
  return true;
}
function release() { inFlight -= 1; }
module.exports = { acquire, release };