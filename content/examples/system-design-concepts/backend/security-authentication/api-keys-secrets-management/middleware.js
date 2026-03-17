const keys = require('./keys.json').keys;

function apiKeyAuth(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || !keys.includes(key)) return res.status(401).json({ error: 'invalid key' });
  next();
}

module.exports = { apiKeyAuth };