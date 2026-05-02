const { rabinKarp } = require("../example-1/algorithm");
const text = "aaaaa";
const pattern = "aa";
let index = 0;
const hits = [];
while (index <= text.length - pattern.length) {
  const pos = rabinKarp(text.slice(index), pattern);
  if (pos === -1) break;
  hits.push(index + pos);
  index += pos + 1;
}
console.log("Hits:", hits);
