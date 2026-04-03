type StreamSnapshot = { nextExpected: number; bufferedSeqs: number[]; processedSeqs: number[] };

function classifyOrdering(snapshot: StreamSnapshot) {
  const gapOpen = snapshot.bufferedSeqs.some((seq) => seq > snapshot.nextExpected);
  return {
    nextExpected: snapshot.nextExpected,
    gapOpen,
    action: gapOpen ? 'hold-buffer-and-alert-publisher' : 'drain-normally',
  };
}

const results = [
  { nextExpected: 3, bufferedSeqs: [3, 4], processedSeqs: [1, 2] },
  { nextExpected: 3, bufferedSeqs: [4, 5], processedSeqs: [1, 2] },
].map(classifyOrdering);

console.table(results);
if (results[1].action !== 'hold-buffer-and-alert-publisher') throw new Error('Missing sequence should hold the buffer');
