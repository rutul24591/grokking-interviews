function shouldCollect({ consent, retentionDays, sampleRate, random }) {
  if (!consent) return false;
  if (retentionDays > 30) return false;
  return random <= sampleRate;
}

console.log(shouldCollect({ consent: true, retentionDays: 14, sampleRate: 0.5, random: 0.4 }));
console.log(shouldCollect({ consent: false, retentionDays: 14, sampleRate: 1, random: 0.1 }));
console.log(shouldCollect({ consent: true, retentionDays: 90, sampleRate: 1, random: 0.1 }));
