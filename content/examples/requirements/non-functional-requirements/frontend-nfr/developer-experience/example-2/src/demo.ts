type ConfigError = { key: string; kind: 'missing' | 'format' | 'secret-exposed'; blocking: boolean };

function formatAction(item: ConfigError) {
  return {
    key: item.key,
    severity: item.blocking ? 'error' : 'warn',
    action: item.kind === 'secret-exposed' ? 'redact-before-logging' : item.kind === 'missing' ? 'add-required-config' : 'fix-invalid-format',
  };
}

const results = [
  { key: 'API_KEY', kind: 'secret-exposed', blocking: true },
  { key: 'PUBLIC_BASE_URL', kind: 'format', blocking: true },
].map(formatAction);

console.table(results);
if (results[0].action !== 'redact-before-logging') throw new Error('Secrets must be redacted');
