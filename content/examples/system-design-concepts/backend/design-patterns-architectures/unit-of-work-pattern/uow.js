const changes = [];
function add(change) { changes.push(change); }
function commit() { changes.length = 0; }
module.exports = { add, commit };