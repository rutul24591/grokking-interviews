const { Trie } = require("../example-1/trie");

const trie = new Trie();
["go", "go", "gone", "guild"].forEach((word) => trie.insert(word));

console.log("All words:", trie.collect(""));
console.log("Missing prefix 'z':", trie.collect("z"));
