class TrieSimple {
  constructor() {
    this.words = new Set();
  }

  insert(word) {
    this.words.add(word);
  }

  search(word) {
    return this.words.has(word);
  }

  startsWith(prefix) {
    for (const w of this.words) {
      if (w.startsWith(prefix)) return true;
    }
    return false;
  }
}

if (require.main === module) {
  const trie = new TrieSimple();
  trie.insert("apple");
  console.log(trie.search("apple"));
  console.log(trie.search("app"));
  console.log(trie.startsWith("app"));
}

module.exports = { TrieSimple };
