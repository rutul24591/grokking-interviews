const clients = 1000;
const invalidatedKeys = ['catalog', 'pricing', 'inventory'];
console.log({ clients, invalidatedKeys, originRequestsBurst: clients * invalidatedKeys.length });
