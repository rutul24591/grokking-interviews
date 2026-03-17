const { next } = require('./queue');
function process() {
  const job = next();
  if (!job) return;
  console.log('resize', job.assetId, job.width);
}
setInterval(process, 1000);