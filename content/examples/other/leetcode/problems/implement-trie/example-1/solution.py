class TrieSimple:
    def __init__(self):
        self.words = set()

    def insert(self, word):
        self.words.add(word)

    def search(self, word):
        return word in self.words

    def starts_with(self, prefix):
        for w in self.words:
            if w.startswith(prefix):
                return True
        return False


if __name__ == "__main__":
    trie = TrieSimple()
    trie.insert("apple")
    print(trie.search("apple"))
    print(trie.search("app"))
    print(trie.starts_with("app"))
