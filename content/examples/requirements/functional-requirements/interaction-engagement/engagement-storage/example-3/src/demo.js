function detectCounterDrift(shards) {
  const drifted = shards.filter((shard) => Math.abs(shard.primary - shard.replica) > shard.tolerance).map((shard) => shard.id);
  const replayBlocked = shards.filter((shard) => shard.backlogMinutes > shard.maxBacklogMinutes).map((shard) => shard.id);
  return {
    drifted,
    replayBlocked,
    triggerReconcile: drifted.length > 0 || replayBlocked.length > 0,
    degradeToApproximate: replayBlocked.length > 0
  };
}

console.log(detectCounterDrift([
  { id: "sh-1", primary: 1042, replica: 1038, tolerance: 2, backlogMinutes: 4, maxBacklogMinutes: 10 },
  { id: "sh-2", primary: 401, replica: 401, tolerance: 2, backlogMinutes: 28, maxBacklogMinutes: 15 }
]));
