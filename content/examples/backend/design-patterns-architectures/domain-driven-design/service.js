const { createOrder } = require('./order');
function place(items) { return createOrder(items); }
module.exports = { place };