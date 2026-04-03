type RotationWindow = { kid: string; active: boolean; oldTokensRemaining: number; hoursSinceRotation: number };

function decideKeyRetirement(window: RotationWindow) {
  const retireable = !window.active && window.oldTokensRemaining === 0 && window.hoursSinceRotation > 24;
  return {
    kid: window.kid,
    retireable,
    action: retireable ? 'retire-key-material' : 'keep-for-verification',
  };
}

const results = [
  { kid: 'key-a', active: false, oldTokensRemaining: 0, hoursSinceRotation: 30 },
  { kid: 'key-b', active: false, oldTokensRemaining: 14, hoursSinceRotation: 30 },
].map(decideKeyRetirement);

console.table(results);
if (results[1].action !== 'keep-for-verification') throw new Error('Old tokens should block retirement');
