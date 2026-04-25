class Graph {
  constructor() {
    this.adjacency = new Map();
  }

  addEdge(from, to) {
    if (!this.adjacency.has(from)) this.adjacency.set(from, []);
    if (!this.adjacency.has(to)) this.adjacency.set(to, []);
    this.adjacency.get(from).push(to);
  }

  shortestPath(start, target) {
    const queue = [[start, [start]]];
    const visited = new Set([start]);

    while (queue.length) {
      const [node, path] = queue.shift();
      if (node === target) return path;

      for (const neighbor of this.adjacency.get(node) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }

    return null;
  }
}

module.exports = { Graph };
