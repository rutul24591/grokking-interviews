const users = new Map();
function create(user) { users.set(user.id, user); return user; }
function get(id) { return users.get(id); }
module.exports = { create, get };