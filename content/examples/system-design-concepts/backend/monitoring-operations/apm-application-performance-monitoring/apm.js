function apm(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const latency = Date.now() - start;
    console.log(JSON.stringify({ path: req.path, latency, status: res.statusCode }));
  });
  next();
}

module.exports = { apm };