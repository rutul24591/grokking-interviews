const { listUsers } = require('./service');
function route(req, res) {
  res.json(listUsers());
}
module.exports = { route };