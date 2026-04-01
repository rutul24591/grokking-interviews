function tieBreak(candidates) {
  return [...candidates].sort((a, b) => b.engagement - a.engagement || a.ageHours - b.ageHours).map((candidate) => candidate.id);
}
console.log(tieBreak([{ id: 'a', engagement: 0.8, ageHours: 10 }, { id: 'b', engagement: 0.8, ageHours: 2 }]));
