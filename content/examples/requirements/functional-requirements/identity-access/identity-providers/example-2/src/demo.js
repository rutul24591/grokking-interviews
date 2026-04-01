function providerForEmail(email, rules) {
  const domain = email.split('@')[1] ?? '';
  return rules.find((rule) => rule.domains.includes(domain))?.provider ?? 'local';
}

console.log(providerForEmail('user@acme.com', [{ provider: 'workspace-sso', domains: ['acme.com'] }]));
console.log(providerForEmail('user@example.org', [{ provider: 'workspace-sso', domains: ['acme.com'] }]));
