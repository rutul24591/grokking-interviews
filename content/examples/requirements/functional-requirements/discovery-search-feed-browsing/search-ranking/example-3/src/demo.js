function rankingRegression(previousIds, currentIds, protectedIds) {
  return protectedIds.filter((id) => previousIds.indexOf(id) < currentIds.indexOf(id));
}

console.log(rankingRegression(["pinned", "a", "b"], ["a", "b", "pinned"], ["pinned"]));
