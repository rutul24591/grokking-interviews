const cache = require('./cache');
const repo = require('./repo');
function getUser(id) {
  const cached = cache.get(id);
  if (cached) return cached;
  const user = repo.fetchUser(id);
  cache.set(id, user);
  return user;
}
module.exports = { getUser };