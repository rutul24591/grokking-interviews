class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False


class WordDictionaryTrie:
    def __init__(self):
        self.root = TrieNode()

    def add_word(self, word):
        cur = self.root
        for ch in word:
            if ch not in cur.children:
                cur.children[ch] = TrieNode()
            cur = cur.children[ch]
        cur.is_word = True

    def search(self, word):
        def dfs(node, i):
            if i == len(word):
                return node.is_word
            ch = word[i]
            if ch == ".":
                for child in node.children.values():
                    if dfs(child, i + 1):
                        return True
                return False
            if ch not in node.children:
                return False
            return dfs(node.children[ch], i + 1)

        return dfs(self.root, 0)


if __name__ == "__main__":
    wd = WordDictionaryTrie()
    wd.add_word("bad")
    wd.add_word("dad")
    wd.add_word("mad")
    print(wd.search("pad"))
    print(wd.search("bad"))
    print(wd.search(".ad"))
    print(wd.search("b.."))
