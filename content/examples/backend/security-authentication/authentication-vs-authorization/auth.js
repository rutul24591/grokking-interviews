function authenticate(req) {
  const token = req.headers['authorization'];
  if (!token) throw new Error('unauthenticated');
  return { userId: 'u1', role: 'editor' };
}

module.exports = { authenticate };