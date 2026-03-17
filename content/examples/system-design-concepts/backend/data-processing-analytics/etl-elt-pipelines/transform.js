function clean(event) {
  if (!event.userId) return null;
  return { userId: event.userId, ts: event.ts };
}
module.exports = { clean };