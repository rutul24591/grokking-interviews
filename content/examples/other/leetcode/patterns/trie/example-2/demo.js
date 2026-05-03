const { Trie } = require("../example-1/pattern");

function removeWord(trie, word) {
  const stack = [];
  let node = trie.root;
  for (const ch of word) {
    if (!node.children.has(ch)) return false;
    stack.push([node, ch]);
    node = node.children.get(ch);
  }
  if (!node.isWord) return false;
  node.isWord = false;
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const [parent, ch] = stack[i];
    const child = parent.children.get(ch);
    if (child.isWord || child.children.size) break;
    parent.children.delete(ch);
  }
  return true;
}

const trie = new Trie();
["cache","caching","catalog"].forEach((w) => trie.insert(w));
console.log("before:", trie.collect("ca"));
removeWord(trie, "cache");
console.log("after:", trie.collect("ca"));
