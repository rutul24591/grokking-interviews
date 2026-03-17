const repo = require('./repository');
function get(id) { return repo.findById(id); }
module.exports = { get };