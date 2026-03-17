let requests = 0;
let errors = 0;
function record(ok) { requests += 1; if (!ok) errors += 1; }
function snapshot() { return { requests, errors }; }
module.exports = { record, snapshot };