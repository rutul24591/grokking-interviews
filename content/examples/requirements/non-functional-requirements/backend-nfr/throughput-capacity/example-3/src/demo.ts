type QueueSnapshot = { window: string; backlog: number; serviceRate: number; arrivalRate: number };

function detectSaturation(snapshot: QueueSnapshot) {
  const utilization = Number((snapshot.arrivalRate / snapshot.serviceRate).toFixed(2));
  const saturated = utilization >= 1 || snapshot.backlog > snapshot.serviceRate * 2;
  return {
    window: snapshot.window,
    utilization,
    saturated,
    mitigation: saturated ? 'shed-noncritical-load' : 'keep-steady-state',
  };
}

const snapshots = [
  { window: '09:00', backlog: 20, serviceRate: 180, arrivalRate: 140 },
  { window: '12:15', backlog: 410, serviceRate: 180, arrivalRate: 220 },
].map(detectSaturation);

console.table(snapshots);
if (!snapshots[1].saturated) throw new Error('Expected midday snapshot to be saturated');
