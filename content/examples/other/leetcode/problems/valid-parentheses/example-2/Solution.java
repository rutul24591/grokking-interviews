import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;

public class Solution {
  static boolean isValidParenthesesFast(String s) {
    Map<Character, Character> closingToOpening = Map.of(')', '(', ']', '[', '}', '{');
    Deque<Character> stack = new ArrayDeque<>();
    for (int i = 0; i < s.length(); i += 1) {
      char ch = s.charAt(i);
      if (closingToOpening.containsKey(ch)) {
        if (stack.isEmpty()) return false;
        char open = stack.removeLast();
        if (open != closingToOpening.get(ch)) return false;
      } else {
        stack.addLast(ch);
      }
    }
    return stack.isEmpty();
  }

  public static void main(String[] args) {
    System.out.println(isValidParenthesesFast("()[]{}"));
    System.out.println(isValidParenthesesFast("([)]"));
  }
}
