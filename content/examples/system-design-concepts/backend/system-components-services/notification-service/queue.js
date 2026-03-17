const queue = [];
function enqueue(message) { queue.push(message); }
function drain() { return queue.splice(0, queue.length); }
module.exports = { enqueue, drain };