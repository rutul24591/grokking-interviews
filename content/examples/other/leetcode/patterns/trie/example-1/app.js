const { Trie } = require("./pattern");
const trie = new Trie();
["apple","app","apply","apt","bat"].forEach((w) => trie.insert(w));
console.log(trie.collect("ap"));
console.log(trie.collect("bat"));
