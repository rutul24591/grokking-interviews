function detectEncryptionFailures(cases) {
  return cases.map((entry) => ({
    device: entry.device,
    requireReverification: entry.identityRotated,
    showUnknownDeviceBanner: entry.deviceNotRecognized,
    pauseTimelineUntilRekey: entry.sessionMismatch || entry.missingPreKey
  }));
}

console.log(JSON.stringify(detectEncryptionFailures([
  { device: "primary", identityRotated: false, deviceNotRecognized: false, sessionMismatch: false, missingPreKey: false },
  { device: "reinstall", identityRotated: true, deviceNotRecognized: true, sessionMismatch: false, missingPreKey: false },
  { device: "backup", identityRotated: false, deviceNotRecognized: false, sessionMismatch: true, missingPreKey: true }
]), null, 2));
