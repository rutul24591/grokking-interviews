const policy = require('./policy.json');

function authorize(req, res, next) {
  const key = req.headers['x-api-key'];
  const scope = req.headers['x-scope'];
  const allowed = (policy.scopes[key] || []).includes(scope);
  if (!allowed) return res.status(403).json({ error: 'forbidden' });
  next();
}

module.exports = { authorize };