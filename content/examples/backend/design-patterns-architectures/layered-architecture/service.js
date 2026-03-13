const { getUsers } = require('./repo');
function listUsers() { return getUsers(); }
module.exports = { listUsers };