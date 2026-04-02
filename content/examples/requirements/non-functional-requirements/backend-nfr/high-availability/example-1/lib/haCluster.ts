type NodeId = "A" | "B";
type NodeState = { id: NodeId; up: boolean; data: Record<string, string> };

class HACluster {
  private nodes: Record<NodeId, NodeState> = {
    A: { id: "A", up: true, data: {} },
    B: { id: "B", up: true, data: {} }
  };
  private leader: NodeId = "A";

  snapshot() {
    return {
      leader: this.leader,
      nodes: Object.values(this.nodes).map((n) => ({ id: n.id, up: n.up, keys: Object.keys(n.data).length }))
    };
  }

  fail(node: NodeId) {
    this.nodes[node].up = false;
  }

  elect() {
    const candidates: NodeId[] = ["A", "B"];
    const next = candidates.find((id) => this.nodes[id].up);
    if (!next) throw new Error("no_nodes_up");
    this.leader = next;
    return this.leader;
  }

  write(key: string, value: string) {
    const leader = this.nodes[this.leader];
    if (!leader.up) throw new Error("leader_down");

    // Simplified: synchronous replication to follower.
    leader.data[key] = value;
    const followerId: NodeId = this.leader === "A" ? "B" : "A";
    const follower = this.nodes[followerId];
    if (follower.up) follower.data[key] = value;

    return { leader: this.leader };
  }

  read(key: string, from?: NodeId) {
    const node = from ? this.nodes[from] : this.nodes[this.leader];
    if (!node.up) throw new Error("node_down");
    return node.data[key] ?? null;
  }
}

export const cluster = new HACluster();

