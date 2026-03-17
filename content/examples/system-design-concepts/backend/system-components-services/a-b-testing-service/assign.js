function assign(userId) {
  return userId % 2 === 0 ? 'A' : 'B';
}
module.exports = { assign };