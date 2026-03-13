let requests = 0;
function log(msg, ctx) { console.log(JSON.stringify({ msg, ...ctx })); }
function metric() { requests += 1; return requests; }
module.exports = { log, metric };