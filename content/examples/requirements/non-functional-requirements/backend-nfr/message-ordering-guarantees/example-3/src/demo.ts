type StreamHealth = { duplicateCount: number; gapCount: number; replayLag: number };

function classifyStreamHealth(input: StreamHealth) {
  const unhealthy = input.duplicateCount > 0 || input.gapCount > 0 || input.replayLag > 500;
  return {
    ...input,
    unhealthy,
    action: unhealthy ? 'pause-consumer-and-investigate-ordering' : 'stream-healthy',
  };
}

const results = [
  { duplicateCount: 0, gapCount: 0, replayLag: 30 },
  { duplicateCount: 1, gapCount: 2, replayLag: 640 },
].map(classifyStreamHealth);

console.table(results);
if (results[1].action !== 'pause-consumer-and-investigate-ordering') throw new Error('Ordering faults should pause the consumer');
