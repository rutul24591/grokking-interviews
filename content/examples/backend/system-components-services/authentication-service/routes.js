const { login } = require('./service');
function handle(req, res) {
  const { userId, password } = req.body;
  const result = login(userId, password);
  if (!result) return res.status(401).json({ error: 'invalid_credentials' });
  return res.json(result);
}
module.exports = { handle };