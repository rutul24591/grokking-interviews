const store = require('./store');
function register(id, email) { return store.create({ id, email }); }
function profile(id) { return store.get(id); }
module.exports = { register, profile };