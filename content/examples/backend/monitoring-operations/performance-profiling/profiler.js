function profile(fn) {
  const start = Date.now();
  const result = fn();
  const latency = Date.now() - start;
  console.log('latency', latency);
  return result;
}
module.exports = { profile };