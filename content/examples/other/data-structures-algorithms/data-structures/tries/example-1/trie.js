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
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) current.children.set(char, new TrieNode());
      current = current.children.get(char);
    }
    current.isWord = true;
  }

  collect(prefix) {
    let current = this.root;
    for (const char of prefix) {
      current = current.children.get(char);
      if (!current) return [];
    }

    const results = [];
    const dfs = (node, path) => {
      if (node.isWord) results.push(path);
      for (const [char, child] of node.children) dfs(child, path + char);
    };

    dfs(current, prefix);
    return results;
  }
}

module.exports = { Trie };
