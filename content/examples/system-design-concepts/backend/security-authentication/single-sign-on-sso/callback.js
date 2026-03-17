function handleCallback(req, res) {
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: 'missing token' });
  res.setHeader('Set-Cookie', 'sid=sso1; HttpOnly; Secure');
  res.redirect('/');
}

module.exports = { handleCallback };