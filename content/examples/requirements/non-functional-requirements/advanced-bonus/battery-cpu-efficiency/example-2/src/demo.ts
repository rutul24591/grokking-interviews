type PollCase = { surface: string; pollingMs: number; wakeupsPerMinute: number; background: boolean };

function choosePollingPolicy(input: PollCase) {
  const expensive = input.wakeupsPerMinute > 24 || input.pollingMs < 3000;
  return {
    surface: input.surface,
    expensive,
    policy: input.background ? 'pause-and-switch-to-push' : expensive ? 'throttle-and-batch' : 'keep-current-rate',
  };
}

const results = [
  { surface: 'live-scores', pollingMs: 1000, wakeupsPerMinute: 60, background: false },
  { surface: 'notifications', pollingMs: 5000, wakeupsPerMinute: 10, background: true },
].map(choosePollingPolicy);

console.table(results);
if (results[0].policy !== 'throttle-and-batch') throw new Error('Live scores should throttle');
if (results[1].policy !== 'pause-and-switch-to-push') throw new Error('Background poller should pause');
