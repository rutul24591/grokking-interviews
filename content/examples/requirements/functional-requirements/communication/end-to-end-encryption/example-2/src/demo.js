function evaluateEncryptionReadiness(cases) {
  return cases.map((entry) => ({
    device: entry.device,
    canEncrypt: entry.identityKeyPresent && entry.sessionKeyPresent && entry.verified,
    needsSafetyNumberCheck: entry.identityChanged,
    holdMessages: !entry.sessionKeyPresent || entry.untrustedDevice
  }));
}

console.log(JSON.stringify(evaluateEncryptionReadiness([
  { device: "primary", identityKeyPresent: true, sessionKeyPresent: true, verified: true, identityChanged: false, untrustedDevice: false },
  { device: "reinstall", identityKeyPresent: true, sessionKeyPresent: true, verified: false, identityChanged: true, untrustedDevice: true },
  { device: "new device", identityKeyPresent: true, sessionKeyPresent: false, verified: false, identityChanged: false, untrustedDevice: true }
]), null, 2));
