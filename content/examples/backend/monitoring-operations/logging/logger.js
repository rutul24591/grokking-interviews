function log(level, msg, ctx) {
  console.log(JSON.stringify({ level, msg, ...ctx }));
}

module.exports = { log };