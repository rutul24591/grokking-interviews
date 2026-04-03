type Failure = { dependency: string; criticalPath: boolean; fallbackAvailable: boolean; vendorOutage: boolean };

function chooseDependencyMitigation(input: Failure) {
  return {
    dependency: input.dependency,
    mitigation: input.vendorOutage && input.criticalPath && !input.fallbackAvailable ? 'enter-degraded-mode-and-page-owner' : input.vendorOutage ? 'switch-to-fallback' : 'keep-current-provider',
  };
}

const results = [
  { dependency: 'search-api', criticalPath: false, fallbackAvailable: true, vendorOutage: true },
  { dependency: 'payments-gateway', criticalPath: true, fallbackAvailable: false, vendorOutage: true },
].map(chooseDependencyMitigation);

console.table(results);
if (results[1].mitigation !== 'enter-degraded-mode-and-page-owner') throw new Error('Critical vendor outage should trigger degraded mode');

console.log(JSON.stringify({ ok: true }, null, 2));
