function detectStaleWrite(clientVersion, serverVersion) {
  return { allowed: clientVersion === serverVersion, conflict: clientVersion !== serverVersion };
}

console.log(detectStaleWrite(4, 4));
console.log(detectStaleWrite(4, 5));
