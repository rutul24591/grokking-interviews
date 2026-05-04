import java.util.ArrayList;
import java.util.List;

public class Solution {
  static class WordDictionaryList {
    private final List<String> words = new ArrayList<>();

    void addWord(String word) {
      words.add(word);
    }

    boolean search(String pattern) {
      for (String w : words) {
        if (w.length() != pattern.length()) continue;
        boolean ok = true;
        for (int i = 0; i < w.length(); i += 1) {
          char p = pattern.charAt(i);
          if (p != '.' && p != w.charAt(i)) {
            ok = false;
            break;
          }
        }
        if (ok) return true;
      }
      return false;
    }
  }

  public static void main(String[] args) {
    WordDictionaryList wd = new WordDictionaryList();
    wd.addWord("bad");
    wd.addWord("dad");
    wd.addWord("mad");
    System.out.println(wd.search("pad"));
    System.out.println(wd.search("bad"));
    System.out.println(wd.search(".ad"));
    System.out.println(wd.search("b.."));
  }
}
