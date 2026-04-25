const { Trie } = require("./trie");

const trie = new Trie();
["cache", "caching", "catalog", "category", "queue"].forEach((word) =>
  trie.insert(word),
);

console.log("Suggestions for 'cat':", trie.collect("cat"));
console.log("Suggestions for 'cach':", trie.collect("cach"));
