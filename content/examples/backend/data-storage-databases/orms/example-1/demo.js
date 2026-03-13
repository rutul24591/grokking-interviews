// Demonstrates N+1 and eager loading patterns.

const orm = require("./orm");

function nPlusOne() {
  orm.resetQueryCount();
  const users = orm.findUsers();
  const withOrders = users.map((user) => ({
    ...user,
    orders: orm.findOrdersByUser(user.id),
  }));
  console.log("N+1 queries", orm.getQueryCount(), withOrders);
}

function eagerLoad() {
  orm.resetQueryCount();
  const users = orm.findUsers();
  const orders = orm.findOrdersByUsers(users.map((u) => u.id));
  const grouped = orders.reduce((acc, order) => {
    acc[order.user_id] = acc[order.user_id] || [];
    acc[order.user_id].push(order);
    return acc;
  }, {});
  const withOrders = users.map((u) => ({ ...u, orders: grouped[u.id] || [] }));
  console.log("Eager queries", orm.getQueryCount(), withOrders);
}

nPlusOne();
eagerLoad();
