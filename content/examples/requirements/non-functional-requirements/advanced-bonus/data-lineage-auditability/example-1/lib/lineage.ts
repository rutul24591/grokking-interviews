import { randomUUID } from "node:crypto";

export type LineageNode = {
  id: string;
  kind: "dataset";
  name: string;
  version: string;
};

export type LineageEdge = {
  id: string;
  from: string;
  to: string;
  type: "derived_from";
  ts: string;
  jobRunId: string;
};

export class LineageGraph {
  private nodes = new Map<string, LineageNode>();
  private edges: LineageEdge[] = [];

  upsertDataset(params: { name: string; version: string }): LineageNode {
    const key = `${params.name}@${params.version}`;
    const existing = this.nodes.get(key);
    if (existing) return existing;
    const node: LineageNode = { id: randomUUID(), kind: "dataset", name: params.name, version: params.version };
    this.nodes.set(key, node);
    return node;
  }

  addDerivedFrom(params: { from: LineageNode; to: LineageNode; jobRunId: string }): LineageEdge {
    const edge: LineageEdge = {
      id: randomUUID(),
      from: params.from.id,
      to: params.to.id,
      type: "derived_from",
      ts: new Date().toISOString(),
      jobRunId: params.jobRunId,
    };
    this.edges.push(edge);
    return edge;
  }

  snapshot() {
    return {
      nodes: [...this.nodes.values()].sort((a, b) => a.name.localeCompare(b.name)),
      edges: [...this.edges].slice(-300),
    };
  }
}

