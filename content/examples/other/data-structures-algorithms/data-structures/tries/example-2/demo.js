const { Trie } = require("../example-1/trie");

const trie = new Trie();
["api", "app", "apple", "apply", "apt"].forEach((word) => trie.insert(word));

const suggestions = trie.collect("ap");
console.log("Words under 'ap':", suggestions);
console.log("Prefix count:", suggestions.length);
