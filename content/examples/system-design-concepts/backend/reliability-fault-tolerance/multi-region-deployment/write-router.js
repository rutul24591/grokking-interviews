const region = process.env.REGION;
const primary = 'us-east';

function routeWrite(req, res, next) {
  if (region !== primary) return res.status(307).json({ redirect: primary });
  next();
}

module.exports = { routeWrite };