function replay(events, handler) {
  for (const e of events) handler(e);
}
module.exports = { replay };