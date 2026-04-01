function lowAndSlow(attempts, maxPerHour) {
  return {
    suspicious: attempts.every((attempt) => attempt.intervalMinutes >= 20) && attempts.length > maxPerHour,
    attempts: attempts.length,
  };
}

console.log(lowAndSlow([{ intervalMinutes: 25 }, { intervalMinutes: 30 }, { intervalMinutes: 35 }, { intervalMinutes: 40 }], 3));
