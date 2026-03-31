function classify(source) {
  if (/setInterval|setTimeout/.test(source)) return { source, bucket: "timer", mitigation: "clear handles on unmount" };
  if (/addEventListener/.test(source)) return { source, bucket: "listener", mitigation: "unsubscribe in cleanup" };
  if (/Map|cache|memoized/i.test(source)) return { source, bucket: "cache", mitigation: "apply size or TTL eviction" };
  if (/detached|portal|overlay/i.test(source)) return { source, bucket: "detached-dom", mitigation: "drop references after removal" };
  return "unknown";
}

console.log(classify("window.addEventListener(resize, handler)"));
console.log(classify("setInterval(poll, 1000)"));
