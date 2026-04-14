"""
Example 1: HNSW Index Implementation (Simplified)

Demonstrates:
- Multi-layer HNSW graph construction
- Greedy search through graph layers
- Parameter tuning (M, ef_construction, ef)
- Recall measurement against exact search
"""

import math
import random
from typing import List, Dict, Tuple, Optional


class HNSWNode:
    def __init__(self, vector: List[float], node_id: int, level: int):
        self.vector = vector
        self.id = node_id
        self.level = level  # Number of layers this node participates in
        self.connections: List[List[int]] = [[] for _ in range(level + 1)]


def cosine_similarity(a: List[float], b: List[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0


class SimplifiedHNSW:
    """Simplified HNSW implementation for educational purposes."""

    def __init__(self, M: int = 16, ef_construction: int = 100, max_level: int = 4):
        self.M = M  # Max connections per layer
        self.ef_construction = ef_construction
        self.max_level = max_level
        self.nodes: Dict[int, HNSWNode] = {}
        self.entry_point: Optional[int] = None

    def _random_level(self) -> int:
        """Assign random level to new node (exponential decay)."""
        level = 0
        while level < self.max_level and random.random() < 0.3:
            level += 1
        return level

    def _search_layer(self, query: List[float], node_id: int, ef: int, layer: int) -> List[Tuple[float, int]]:
        """Greedy search on a single layer."""
        candidates = [(cosine_similarity(query, self.nodes[node_id].vector), node_id)]
        visited = {node_id}
        result = candidates[:]

        while candidates:
            candidates.sort(reverse=True)
            best_sim, best_id = candidates.pop(0)

            # Stop if we've found ef better candidates
            if len(result) >= ef and best_sim < result[-1][0]:
                break

            for neighbor_id in self.nodes[best_id].connections[layer]:
                if neighbor_id not in visited:
                    visited.add(neighbor_id)
                    sim = cosine_similarity(query, self.nodes[neighbor_id].vector)
                    if len(result) < ef or sim > result[-1][0]:
                        result.append((sim, neighbor_id))
                        candidates.append((sim, neighbor_id))
                        result.sort(reverse=True)
                        result = result[:ef]

        return result[:ef]

    def insert(self, node_id: int, vector: List[float]) -> None:
        """Insert a vector into the HNSW index."""
        level = self._random_level()
        node = HNSWNode(vector, node_id, level)
        self.nodes[node_id] = node

        if self.entry_point is None:
            self.entry_point = node_id
            return

        # Search from top layer down, inserting connections
        current_ep = self.entry_point
        for layer in range(self.max_level, -1, -1):
            if layer > level:
                # Descend without inserting
                results = self._search_layer(vector, current_ep, 1, layer)
                if results:
                    current_ep = results[0][1]
            else:
                # Search and connect
                results = self._search_layer(vector, current_ep, self.ef_construction, layer)
                node.connections[layer] = [nid for _, nid in results[:self.M]]
                for _, nid in results[:self.M]:
                    if len(self.nodes[nid].connections[layer]) < self.M:
                        self.nodes[nid].connections[layer].append(node_id)

        if level > (self.nodes[self.entry_point].level if self.entry_point else 0):
            self.entry_point = node_id

    def search(self, query: List[float], k: int = 5, ef: int = 50) -> List[Tuple[float, int]]:
        """Search for k nearest neighbors."""
        if not self.nodes:
            return []

        current_ep = self.entry_point
        # Descend through layers
        for layer in range(self.max_level, 0, -1):
            results = self._search_layer(query, current_ep, 1, layer)
            if results:
                current_ep = results[0][1]

        # Final search at layer 0
        results = self._search_layer(query, current_ep, ef, 0)
        return results[:k]

    def exact_search(self, query: List[float], k: int = 5) -> List[Tuple[float, int]]:
        """Brute-force exact nearest neighbor search."""
        scores = []
        for node_id, node in self.nodes.items():
            sim = cosine_similarity(query, node.vector)
            scores.append((sim, node_id))
        scores.sort(reverse=True)
        return scores[:k]


def main():
    random.seed(42)
    dim = 32
    n_vectors = 1000

    # Generate random vectors
    vectors = [[random.gauss(0, 1) for _ in range(dim)] for _ in range(n_vectors)]

    # Build index
    hnsw = SimplifiedHNSW(M=16, ef_construction=100)
    for i, vec in enumerate(vectors):
        hnsw.insert(i, vec)

    print(f"=== HNSW Index ===")
    print(f"Vectors: {n_vectors}, Dimensions: {dim}")
    print(f"Parameters: M={hnsw.M}, ef_construction={hnsw.ef_construction}")

    # Test search accuracy
    n_queries = 50
    k = 5
    recall_sum = 0.0

    for _ in range(n_queries):
        query = [random.gauss(0, 1) for _ in range(dim)]

        # Exact results
        exact_results = set(nid for _, nid in hnsw.exact_search(query, k))
        # HNSW results
        hnsw_results = set(nid for _, nid in hnsw.search(query, k, ef=50))

        recall = len(exact_results & hnsw_results) / k
        recall_sum += recall

    avg_recall = recall_sum / n_queries
    print(f"\nSearch Accuracy (k={k}):")
    print(f"  Average Recall@{k}: {avg_recall:.3f}")
    print(f"  (1.000 = perfect, 0.95+ = production-quality)")


if __name__ == "__main__":
    main()
