import java.util.HashSet;
import java.util.Set;

public class Solution {
  static class TrieSimple {
    private final Set<String> words = new HashSet<>();

    void insert(String word) {
      words.add(word);
    }

    boolean search(String word) {
      return words.contains(word);
    }

    boolean startsWith(String prefix) {
      for (String w : words) {
        if (w.startsWith(prefix)) return true;
      }
      return false;
    }
  }

  public static void main(String[] args) {
    TrieSimple trie = new TrieSimple();
    trie.insert("apple");
    System.out.println(trie.search("apple"));
    System.out.println(trie.search("app"));
    System.out.println(trie.startsWith("app"));
  }
}
