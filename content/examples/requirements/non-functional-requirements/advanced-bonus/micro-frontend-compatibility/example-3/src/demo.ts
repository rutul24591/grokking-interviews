type BusEvent = { source: string; version: number; type: string; payloadKeys: string[]; requiredKeys: string[] };

function validateEventContract(event: BusEvent) {
  const missingKeys = event.requiredKeys.filter((key) => !event.payloadKeys.includes(key));
  return {
    source: event.source,
    type: event.type,
    valid: event.version >= 2 && missingKeys.length === 0,
    fallback: missingKeys.length === 0 ? 'accept' : 'reject-and-log-contract-error',
    missingKeys,
  };
}

const validations = [
  { source: 'profile', version: 2, type: 'route-change', payloadKeys: ['to', 'replace'], requiredKeys: ['to'] },
  { source: 'billing', version: 1, type: 'route-change', payloadKeys: ['replace'], requiredKeys: ['to'] },
].map(validateEventContract);

console.table(validations);
if (validations[1].valid) throw new Error('Old billing event should be rejected');
