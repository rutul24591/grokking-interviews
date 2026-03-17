function createOrder(items) {
  if (items.length === 0) throw new Error('empty');
  return { id: 'o1', items };
}
module.exports = { createOrder };