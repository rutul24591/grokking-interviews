function canAccess(roleRank, routeRank) {
  return roleRank >= routeRank;
}

console.log(canAccess(1, 2));
console.log(canAccess(2, 1));
