function restoreRouteState(cache, nextPath) {
  const match = cache.find((entry) => entry.path === nextPath);
  return {
    path: nextPath,
    restored: Boolean(match),
    state: match ?? { scroll: 0, selection: null }
  };
}

console.log(restoreRouteState([
  { path: "/feed", scroll: 320, selection: null },
  { path: "/saved", scroll: 80, selection: "architecture" }
], "/saved"));
console.log(restoreRouteState([
  { path: "/feed", scroll: 320, selection: null }
], "/search"));
