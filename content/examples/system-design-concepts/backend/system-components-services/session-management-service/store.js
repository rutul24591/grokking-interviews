const sessions = new Map();
function create(userId) {
  const id = 's_' + Math.random().toString(36).slice(2);
  sessions.set(id, { userId, createdAt: Date.now() });
  return id;
}
function get(id) { return sessions.get(id); }
module.exports = { create, get };