class WordDictionaryList:
    def __init__(self):
        self.words = []

    def add_word(self, word):
        self.words.append(word)

    def search(self, pattern):
        for w in self.words:
            if len(w) != len(pattern):
                continue
            ok = True
            for i in range(len(w)):
                p = pattern[i]
                if p != "." and p != w[i]:
                    ok = False
                    break
            if ok:
                return True
        return False


if __name__ == "__main__":
    wd = WordDictionaryList()
    wd.add_word("bad")
    wd.add_word("dad")
    wd.add_word("mad")
    print(wd.search("pad"))
    print(wd.search("bad"))
    print(wd.search(".ad"))
    print(wd.search("b.."))
