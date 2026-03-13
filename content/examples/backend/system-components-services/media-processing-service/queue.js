const jobs = [];
function enqueue(job) { jobs.push(job); }
function next() { return jobs.shift(); }
module.exports = { enqueue, next };