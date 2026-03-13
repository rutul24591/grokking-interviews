const ordersByKey = new Map();
let nextId = 1;

export function createOrder(key, payload) {
  if (!key) {
    return { wasCreated: true, data: { id: "o" + nextId++, status: "created", payload } };
  }
  if (ordersByKey.has(key)) {
    return { wasCreated: false, data: ordersByKey.get(key) };
  }
  const order = { id: "o" + nextId++, status: "created", payload };
  ordersByKey.set(key, order);
  return { wasCreated: true, data: order };
}