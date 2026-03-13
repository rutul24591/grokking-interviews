function rebuild(events) {
  let state = {};
  for (const e of events) state.last = e.type;
  return state;
}
module.exports = { rebuild };