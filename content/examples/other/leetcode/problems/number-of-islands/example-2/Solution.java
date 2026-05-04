public class Solution {
  static class UnionFind {
    int[] parent;
    int[] rank;

    UnionFind(int n) {
      parent = new int[n];
      rank = new int[n];
      for (int i = 0; i < n; i += 1) parent[i] = i;
    }

    int find(int x) {
      while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    }

    boolean union(int a, int b) {
      int ra = find(a);
      int rb = find(b);
      if (ra == rb) return false;
      if (rank[ra] < rank[rb]) {
        int tmp = ra;
        ra = rb;
        rb = tmp;
      }
      parent[rb] = ra;
      if (rank[ra] == rank[rb]) rank[ra] += 1;
      return true;
    }
  }

  static int numIslandsUnionFind(char[][] grid) {
    int rows = grid.length;
    int cols = rows == 0 ? 0 : grid[0].length;
    if (rows == 0 || cols == 0) return 0;

    UnionFind uf = new UnionFind(rows * cols);
    int islands = 0;
    for (int r = 0; r < rows; r += 1) {
      for (int c = 0; c < cols; c += 1) {
        if (grid[r][c] != '1') continue;
        islands += 1;
        int id = r * cols + c;
        if (r > 0 && grid[r - 1][c] == '1') {
          if (uf.union(id, (r - 1) * cols + c)) islands -= 1;
        }
        if (c > 0 && grid[r][c - 1] == '1') {
          if (uf.union(id, r * cols + (c - 1))) islands -= 1;
        }
      }
    }
    return islands;
  }

  public static void main(String[] args) {
    char[][] grid =
        new char[][] {
          new char[] {'1', '1', '0', '0', '0'},
          new char[] {'1', '1', '0', '0', '0'},
          new char[] {'0', '0', '1', '0', '0'},
          new char[] {'0', '0', '0', '1', '1'}
        };
    System.out.println(numIslandsUnionFind(grid));
  }
}
