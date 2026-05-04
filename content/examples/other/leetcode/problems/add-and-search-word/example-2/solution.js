class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
  }
}

class WordDictionaryTrie {
  constructor() {
    this.root = new TrieNode();
  }

  addWord(word) {
    let cur = this.root;
    for (const ch of word) {
      if (!cur.children.has(ch)) cur.children.set(ch, new TrieNode());
      cur = cur.children.get(ch);
    }
    cur.isWord = true;
  }

  search(word) {
    const dfs = (node, i) => {
      if (i === word.length) return node.isWord;
      const ch = word[i];
      if (ch === ".") {
        for (const child of node.children.values()) {
          if (dfs(child, i + 1)) return true;
        }
        return false;
      }
      if (!node.children.has(ch)) return false;
      return dfs(node.children.get(ch), i + 1);
    };
    return dfs(this.root, 0);
  }
}

if (require.main === module) {
  const wd = new WordDictionaryTrie();
  wd.addWord("bad");
  wd.addWord("dad");
  wd.addWord("mad");
  console.log(wd.search("pad"));
  console.log(wd.search("bad"));
  console.log(wd.search(".ad"));
  console.log(wd.search("b.."));
}

module.exports = { WordDictionaryTrie };
