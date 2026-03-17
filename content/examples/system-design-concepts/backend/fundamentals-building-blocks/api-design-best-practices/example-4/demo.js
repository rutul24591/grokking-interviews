// Idempotency key demo.

const store = new Map();
function create(idempotencyKey) {
  if (store.has(idempotencyKey)) return store.get(idempotencyKey);
  const result = { id: Math.floor(Math.random() * 1000) };
  store.set(idempotencyKey, result);
  return result;
}

console.log(create("k1"));
console.log(create("k1"));
