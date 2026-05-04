import java.util.HashMap;
import java.util.Map;

public class Solution {
  static class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isWord = false;
  }

  static class Trie {
    private final TrieNode root = new TrieNode();

    void insert(String word) {
      TrieNode cur = root;
      for (int i = 0; i < word.length(); i += 1) {
        char ch = word.charAt(i);
        cur.children.putIfAbsent(ch, new TrieNode());
        cur = cur.children.get(ch);
      }
      cur.isWord = true;
    }

    boolean search(String word) {
      TrieNode node = walk(word);
      return node != null && node.isWord;
    }

    boolean startsWith(String prefix) {
      return walk(prefix) != null;
    }

    TrieNode walk(String s) {
      TrieNode cur = root;
      for (int i = 0; i < s.length(); i += 1) {
        char ch = s.charAt(i);
        TrieNode next = cur.children.get(ch);
        if (next == null) return null;
        cur = next;
      }
      return cur;
    }
  }

  public static void main(String[] args) {
    Trie trie = new Trie();
    trie.insert("apple");
    System.out.println(trie.search("apple"));
    System.out.println(trie.search("app"));
    System.out.println(trie.startsWith("app"));
  }
}
