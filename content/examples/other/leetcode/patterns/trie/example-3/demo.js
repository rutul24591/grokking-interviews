const { Trie } = require("../example-1/pattern");
const trie = new Trie();
["go","go","gone","guild"].forEach((w) => trie.insert(w));
console.log("all:", trie.collect(""));
console.log("missing:", trie.collect("z"));
console.log("note: normalize Unicode (NFC/NFKC) upstream if you need canonical matching.");
