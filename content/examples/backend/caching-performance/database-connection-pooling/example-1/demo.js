// DB pool basic.

const pool = [1,2];
const conn = pool.pop();
console.log('acquired', conn);
pool.push(conn);
