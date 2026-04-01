function staleCandidateGuard(candidates, maxAgeHours) {
  return candidates.filter((candidate) => candidate.ageHours <= maxAgeHours).map((candidate) => candidate.id);
}
console.log(staleCandidateGuard([{ id: 'a', ageHours: 2 }, { id: 'b', ageHours: 30 }], 24));
