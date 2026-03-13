// Tiny ORM simulation for N+1 vs eager loading.

const db = {
  users: [
    { id: 1, name: "Ada" },
    { id: 2, name: "Grace" },
  ],
  orders: [
    { id: 101, user_id: 1, total: 120 },
    { id: 102, user_id: 1, total: 80 },
    { id: 201, user_id: 2, total: 200 },
  ],
};

let queryCount = 0;

function resetQueryCount() {
  queryCount = 0;
}

function getQueryCount() {
  return queryCount;
}

function findUsers() {
  queryCount += 1;
  return db.users.map((u) => ({ ...u }));
}

function findOrdersByUser(userId) {
  queryCount += 1;
  return db.orders.filter((o) => o.user_id === userId);
}

function findOrdersByUsers(userIds) {
  queryCount += 1;
  return db.orders.filter((o) => userIds.includes(o.user_id));
}

module.exports = {
  resetQueryCount,
  getQueryCount,
  findUsers,
  findOrdersByUser,
  findOrdersByUsers,
};
