class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let cur = this.root;
    for (const ch of word) {
      if (!cur.children.has(ch)) cur.children.set(ch, new TrieNode());
      cur = cur.children.get(ch);
    }
    cur.isWord = true;
  }

  search(word) {
    const node = this._walk(word);
    return node != null && node.isWord === true;
  }

  startsWith(prefix) {
    return this._walk(prefix) != null;
  }

  _walk(s) {
    let cur = this.root;
    for (const ch of s) {
      if (!cur.children.has(ch)) return null;
      cur = cur.children.get(ch);
    }
    return cur;
  }
}

if (require.main === module) {
  const trie = new Trie();
  trie.insert("apple");
  console.log(trie.search("apple"));
  console.log(trie.search("app"));
  console.log(trie.startsWith("app"));
}

module.exports = { Trie };
