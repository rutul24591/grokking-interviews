const keys = require('./keys.json');

function auth(req, res, next) {
  const key = req.headers['x-api-key'];
  if (key !== keys.active && key !== keys.previous) {
    return res.status(401).json({ error: 'invalid key' });
  }
  next();
}

module.exports = { auth };