function restoreAllowed({ deviceBound, sameDevice, tokenExpired }) {
  return !tokenExpired && (!deviceBound || sameDevice);
}

console.log(restoreAllowed({ deviceBound: true, sameDevice: true, tokenExpired: false }));
console.log(restoreAllowed({ deviceBound: true, sameDevice: false, tokenExpired: false }));
