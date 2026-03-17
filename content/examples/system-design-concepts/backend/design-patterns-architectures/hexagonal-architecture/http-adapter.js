const { placeOrder } = require('./core');
function handle(req, res) {
  res.json(placeOrder(req.body));
}
module.exports = { handle };