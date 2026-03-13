const banned = ['spam', 'abuse'];
function isAllowed(text) {
  return !banned.some(word => text.includes(word));
}
module.exports = { isAllowed };