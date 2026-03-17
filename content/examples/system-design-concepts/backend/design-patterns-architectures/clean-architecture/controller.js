const { createUser } = require('./usecase');
function handle(req, res) {
  res.json(createUser(req.body));
}
module.exports = { handle };