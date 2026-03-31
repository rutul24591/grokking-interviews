function classifyNavigation(history, nextPath, prefetched) {
  const current = history[history.length - 1];
  return {
    duplicatePush: current === nextPath,
    shouldWarmChunk: prefetched.includes(nextPath) === false,
    nextLength: current === nextPath ? history.length : history.length + 1
  };
}

console.log(classifyNavigation(["/feed", "/saved"], "/saved", ["/search"]));
console.log(classifyNavigation(["/feed", "/saved"], "/search", ["/saved"]));
