function dueForRotation(rotatedAtIso, maxAgeDays, nowIso) {
  const ageMs = new Date(nowIso).getTime() - new Date(rotatedAtIso).getTime();
  const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));
  return { due: ageDays >= maxAgeDays, ageDays, scheduleNextReview: ageDays + 7 };
}

console.log(dueForRotation("2026-03-20T10:00:00Z", 30, "2026-04-25T10:00:00Z"));
console.log(dueForRotation("2026-03-20T10:00:00Z", 30, "2026-04-05T10:00:00Z"));
