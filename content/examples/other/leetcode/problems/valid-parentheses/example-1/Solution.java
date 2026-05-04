import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;

public class Solution {
  static boolean isValidParenthesesStack(String s) {
    Map<Character, Character> openToClose = Map.of('(', ')', '[', ']', '{', '}');
    Deque<Character> stack = new ArrayDeque<>();
    for (int i = 0; i < s.length(); i += 1) {
      char ch = s.charAt(i);
      if (openToClose.containsKey(ch)) {
        stack.addLast(ch);
        continue;
      }
      if (stack.isEmpty()) return false;
      char open = stack.removeLast();
      if (openToClose.get(open) != ch) return false;
    }
    return stack.isEmpty();
  }

  public static void main(String[] args) {
    System.out.println(isValidParenthesesStack("()[]{}"));
    System.out.println(isValidParenthesesStack("(]"));
  }
}
