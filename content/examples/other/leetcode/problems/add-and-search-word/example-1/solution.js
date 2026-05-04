class WordDictionaryList {
  constructor() {
    this.words = [];
  }

  addWord(word) {
    this.words.push(word);
  }

  search(pattern) {
    for (const w of this.words) {
      if (w.length !== pattern.length) continue;
      let ok = true;
      for (let i = 0; i < w.length; i += 1) {
        const p = pattern[i];
        if (p !== "." && p !== w[i]) {
          ok = false;
          break;
        }
      }
      if (ok) return true;
    }
    return false;
  }
}

if (require.main === module) {
  const wd = new WordDictionaryList();
  wd.addWord("bad");
  wd.addWord("dad");
  wd.addWord("mad");
  console.log(wd.search("pad"));
  console.log(wd.search("bad"));
  console.log(wd.search(".ad"));
  console.log(wd.search("b.."));
}

module.exports = { WordDictionaryList };
