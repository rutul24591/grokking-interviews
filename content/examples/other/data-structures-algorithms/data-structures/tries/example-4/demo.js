const { Trie } = require("../example-1/trie");

function removeWord(trie, word) {
  const stack = [];
  let current = trie.root;
  for (const char of word) {
    if (!current.children.has(char)) return false;
    stack.push([current, char]);
    current = current.children.get(char);
  }
  if (!current.isWord) return false;
  current.isWord = false;

  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const [parent, char] = stack[i];
    const child = parent.children.get(char);
    if (child.isWord || child.children.size > 0) break;
    parent.children.delete(char);
  }

  return true;
}

const trie = new Trie();
["cache", "caching", "catalog"].forEach((word) => trie.insert(word));
console.log("Before delete:", trie.collect("cac"));
removeWord(trie, "cache");
console.log("After delete cache:", trie.collect("cac"));
console.log("Still has caching:", trie.collect("cach"));
