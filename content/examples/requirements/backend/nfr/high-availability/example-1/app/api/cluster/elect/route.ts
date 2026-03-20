import { cluster } from "@/lib/haCluster";
import { jsonError, jsonOk } from "@/lib/http";

export async function POST() {
  try {
    const leader = cluster.elect();
    return jsonOk({ ok: true, leader, state: cluster.snapshot() });
  } catch (e) {
    return jsonError(503, "no_nodes_up");
  }
}

