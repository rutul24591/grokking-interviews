const blockedPatterns = [/union\s+select/i, /<script/i];

module.exports = function waf(req, res, next) {
  const body = JSON.stringify(req.body || {});
  const target = req.url + ' ' + body;
  if (blockedPatterns.some(rx => rx.test(target))) {
    return res.status(403).json({ error: 'blocked' });
  }
  next();
};