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
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isWord = true;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  collect(prefix) {
    const node = this.startsWith(prefix);
    if (!node) return [];
    const out = [];
    const dfs = (n, path) => {
      if (n.isWord) out.push(path);
      for (const [ch, child] of n.children) dfs(child, path + ch);
    };
    dfs(node, prefix);
    return out;
  }
}

module.exports = { Trie };
