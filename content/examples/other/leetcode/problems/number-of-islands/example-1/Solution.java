public class Solution {
  static int numIslandsMutatingDFS(char[][] grid) {
    int rows = grid.length;
    int cols = rows == 0 ? 0 : grid[0].length;
    int count = 0;
    for (int r = 0; r < rows; r += 1) {
      for (int c = 0; c < cols; c += 1) {
        if (grid[r][c] == '1') {
          count += 1;
          dfs(grid, r, c);
        }
      }
    }
    return count;
  }

  static void dfs(char[][] grid, int r, int c) {
    int rows = grid.length;
    int cols = grid[0].length;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return;
    if (grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
  }

  public static void main(String[] args) {
    char[][] grid =
        new char[][] {
          new char[] {'1', '1', '0', '0', '0'},
          new char[] {'1', '1', '0', '0', '0'},
          new char[] {'0', '0', '1', '0', '0'},
          new char[] {'0', '0', '0', '1', '1'}
        };
    System.out.println(numIslandsMutatingDFS(grid));
  }
}
