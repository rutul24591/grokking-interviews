// Example DNS lookups against the simulated resolver.

const { resolve } = require("./resolver");

function logLookup(domain, type) {
  const result = resolve(domain, type);
  console.log(`${domain} ${type}`, result);
}

logLookup("example.com", "A");
logLookup("api.example.com", "A");
logLookup("_verify.example.com", "TXT");

// Repeat to show cache hits.
logLookup("api.example.com", "A");
