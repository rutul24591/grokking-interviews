function refreshAllowed({ refreshExpired, refreshRevoked, deviceBound, sameDevice }) {
  return !refreshExpired && !refreshRevoked && (!deviceBound || sameDevice);
}

console.log(refreshAllowed({ refreshExpired: false, refreshRevoked: false, deviceBound: true, sameDevice: true }));
console.log(refreshAllowed({ refreshExpired: false, refreshRevoked: true, deviceBound: true, sameDevice: true }));
