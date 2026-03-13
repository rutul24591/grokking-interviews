// Object pool.

const pool = [ {id:1}, {id:2} ];
const obj = pool.pop();
console.log('borrow', obj);
pool.push(obj);
