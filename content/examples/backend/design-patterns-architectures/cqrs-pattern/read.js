function readOrder(id) {
  return { id, status: 'paid' };
}
module.exports = { readOrder };