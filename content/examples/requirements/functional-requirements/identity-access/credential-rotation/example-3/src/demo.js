function rolloutRisk(consumers, activeVersion) {
  const stale = consumers.filter((consumer) => consumer.version !== activeVersion);
  return {
    staleCount: stale.length,
    requiresDualRead: stale.length > 0,
    laggingServices: stale.map((consumer) => consumer.name)
  };
}

console.log(rolloutRisk([{ name: "worker-a", version: 4 }, { name: "worker-b", version: 3 }], 4));
console.log(rolloutRisk([{ name: "worker-a", version: 4 }, { name: "worker-b", version: 4 }], 4));
