function translate(order) {
  return { id: order.legacy_id, total: order.amount_cents / 100 };
}
module.exports = { translate };