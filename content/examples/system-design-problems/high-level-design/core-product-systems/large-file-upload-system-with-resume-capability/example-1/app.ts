const assert = require('node:assert/strict');
const { createStore } = require('./lib/store');
const { buildRequestKey, applyRetryPolicy } = require('./lib/policies');

// Smoke: ensure deterministic request keys and safe retry policy.
const store = createStore();
const key1 = buildRequestKey({ q: 'test', filters: {} });
const key2 = buildRequestKey({ q: 'test', filters: {} });
assert.equal(key1, key2);

const r = applyRetryPolicy({ attempt: 3, baseMs: 200, maxMs: 5_000 });
assert.ok(r.delayMs >= 200);
assert.ok(r.delayMs <= 5_000);

// Basic cache write/read
store.set('k', { ok: true });
assert.deepEqual(store.get('k'), { ok: true });

console.log('OK: HLD example-1 smoke passed for: Design a large file upload system with resume capability');
