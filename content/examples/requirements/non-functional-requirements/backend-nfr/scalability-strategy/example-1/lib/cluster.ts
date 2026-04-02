import { pickShard } from "@/lib/rendezvous";

type Assignment = Record<string, string>; // key -> shardId

class Cluster {
  private shards: string[] = ["shard-1", "shard-2", "shard-3", "shard-4"];
  private assignment: Assignment = {};

  resize(n: number) {
    this.shards = Array.from({ length: n }, (_, i) => `shard-${i + 1}`);
  }

  assign(keys: string[]) {
    const next: Assignment = { ...this.assignment };
    let moved = 0;
    let newlyAssigned = 0;

    for (const k of keys) {
      const prev = next[k];
      const shard = pickShard(k, this.shards);
      if (!prev) newlyAssigned++;
      else if (prev !== shard) moved++;
      next[k] = shard;
    }

    this.assignment = next;
    const distribution: Record<string, number> = {};
    for (const shard of Object.values(this.assignment)) distribution[shard] = (distribution[shard] ?? 0) + 1;

    return { moved, newlyAssigned, totalAssigned: Object.keys(this.assignment).length, shards: this.shards, distribution };
  }

  state() {
    const distribution: Record<string, number> = {};
    for (const shard of Object.values(this.assignment)) distribution[shard] = (distribution[shard] ?? 0) + 1;
    return { shards: this.shards, totalAssigned: Object.keys(this.assignment).length, distribution };
  }
}

export const cluster = new Cluster();

