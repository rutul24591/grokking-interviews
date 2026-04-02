type Client = { name: string; minSupportedApi: number; currentApi: number; usesDeprecatedField: boolean };

function evaluateCompatibility(client: Client) {
  const compatible = client.currentApi >= client.minSupportedApi && !client.usesDeprecatedField;
  return {
    client: client.name,
    compatible,
    releaseGate: compatible ? 'safe-to-roll-forward' : 'keep-compat-shim',
  };
}

const results = [
  { name: 'web', minSupportedApi: 3, currentApi: 4, usesDeprecatedField: false },
  { name: 'android-legacy', minSupportedApi: 3, currentApi: 4, usesDeprecatedField: true },
].map(evaluateCompatibility);

console.table(results);
if (results[1].releaseGate !== 'keep-compat-shim') throw new Error('Legacy client needs compatibility shim');
