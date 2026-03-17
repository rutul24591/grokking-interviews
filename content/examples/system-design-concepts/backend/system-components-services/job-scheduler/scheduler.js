const jobs = [];
function schedule(name, everyMs) { jobs.push({ name, everyMs, last: 0 }); }
function tick() {
  const now = Date.now();
  for (const job of jobs) {
    if (now - job.last >= job.everyMs) {
      job.last = now;
      console.log('run', job.name);
    }
  }
}
setInterval(tick, 1000);
module.exports = { schedule };