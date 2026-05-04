public class Solution {
  static class UnionFind {
    int[] parent;
    int[] rank;
    int components;

    UnionFind(int n) {
      parent = new int[n];
      rank = new int[n];
      components = n;
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
      components -= 1;
      return true;
    }
  }

  static boolean validTreeUnionFind(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    for (int[] e : edges) {
      if (!uf.union(e[0], e[1])) return false;
    }
    return uf.components == 1;
  }

  public static void main(String[] args) {
    System.out.println(validTreeUnionFind(5, new int[][] {{0, 1}, {0, 2}, {0, 3}, {1, 4}}));
    System.out.println(
        validTreeUnionFind(5, new int[][] {{0, 1}, {1, 2}, {2, 3}, {1, 3}, {1, 4}}));
  }
}
