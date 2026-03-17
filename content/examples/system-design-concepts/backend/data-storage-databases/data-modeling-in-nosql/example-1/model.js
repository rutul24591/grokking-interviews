// Query-driven data modeling example.

const store = {
  orders_by_customer: {},
  orders_by_status: {},
};

function writeOrder(order) {
  store.orders_by_customer[order.customer_id] = store.orders_by_customer[order.customer_id] || [];
  store.orders_by_customer[order.customer_id].push(order);

  store.orders_by_status[order.status] = store.orders_by_status[order.status] || [];
  store.orders_by_status[order.status].push(order);
}

function getOrdersByCustomer(customerId) {
  return store.orders_by_customer[customerId] || [];
}

function getOrdersByStatus(status) {
  return store.orders_by_status[status] || [];
}

module.exports = { writeOrder, getOrdersByCustomer, getOrdersByStatus };
