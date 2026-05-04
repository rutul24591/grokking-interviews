import java.util.HashMap;
import java.util.Map;

public class Solution {
  static class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isWord = false;
  }

  static class WordDictionaryTrie {
    private final TrieNode root = new TrieNode();

    void addWord(String word) {
      TrieNode cur = root;
      for (int i = 0; i < word.length(); i += 1) {
        char ch = word.charAt(i);
        cur.children.putIfAbsent(ch, new TrieNode());
        cur = cur.children.get(ch);
      }
      cur.isWord = true;
    }

    boolean search(String word) {
      return dfs(root, word, 0);
    }

    boolean dfs(TrieNode node, String word, int i) {
      if (i == word.length()) return node.isWord;
      char ch = word.charAt(i);
      if (ch == '.') {
        for (TrieNode child : node.children.values()) {
          if (dfs(child, word, i + 1)) return true;
        }
        return false;
      }
      TrieNode next = node.children.get(ch);
      if (next == null) return false;
      return dfs(next, word, i + 1);
    }
  }

  public static void main(String[] args) {
    WordDictionaryTrie wd = new WordDictionaryTrie();
    wd.addWord("bad");
    wd.addWord("dad");
    wd.addWord("mad");
    System.out.println(wd.search("pad"));
    System.out.println(wd.search("bad"));
    System.out.println(wd.search(".ad"));
    System.out.println(wd.search("b.."));
  }
}
