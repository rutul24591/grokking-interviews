// Memoization demo.

const memo = new Map();
function fib(n){ if(memo.has(n)) return memo.get(n); if(n<2) return n; const v=fib(n-1)+fib(n-2); memo.set(n,v); return v; }
console.log(fib(10));
