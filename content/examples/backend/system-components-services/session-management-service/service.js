const store = require('./store');
const sid = store.create('u1');
console.log(store.get(sid));