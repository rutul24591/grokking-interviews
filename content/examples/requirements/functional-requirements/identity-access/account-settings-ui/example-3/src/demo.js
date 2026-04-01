function detectStaleWrite(clientVersion, serverVersion) {
  return {
    stale: clientVersion < serverVersion,
    action: clientVersion < serverVersion ? "refresh-before-save" : "safe-to-save",
  };
}

console.log(detectStaleWrite(3, 4));
console.log(detectStaleWrite(4, 4));
