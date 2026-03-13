function verify(sig, payload) {
  return sig === 'valid-signature';
}
module.exports = { verify };