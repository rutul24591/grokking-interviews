// Simple adjacency list graph implementation.

class Graph {
  constructor() {
    this.edges = new Map();
  }

  addEdge(from, to) {
    if (!this.edges.has(from)) this.edges.set(from, new Set());
    this.edges.get(from).add(to);
  }

  neighbors(node) {
    return Array.from(this.edges.get(node) || []);
  }
}

module.exports = { Graph };
