type RemoteContract = { name: string; hostVersion: number; remoteVersion: number; capabilities: string[]; requiredCapability: string };

function evaluateCompatibility(remote: RemoteContract) {
  const versionGap = Math.abs(remote.hostVersion - remote.remoteVersion);
  const compatible = versionGap <= 1 && remote.capabilities.includes(remote.requiredCapability);
  return {
    remote: remote.name,
    versionGap,
    compatible,
    fallback: compatible ? 'mount-remote' : 'render-host-fallback',
  };
}

const results = [
  { name: 'profile', hostVersion: 4, remoteVersion: 4, capabilities: ['navigate', 'theme-sync'], requiredCapability: 'navigate' },
  { name: 'billing', hostVersion: 4, remoteVersion: 6, capabilities: ['navigate'], requiredCapability: 'navigate' },
  { name: 'search', hostVersion: 4, remoteVersion: 5, capabilities: ['theme-sync'], requiredCapability: 'navigate' },
].map(evaluateCompatibility);

console.table(results);
if (results.filter((result) => result.compatible).length !== 1) {
  throw new Error('Expected exactly one remote to be directly mountable');
}
