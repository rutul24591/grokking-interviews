function protocolForTenant(tenant) {
  return tenant.enterprise ? "SAML" : "OIDC";
}

console.log(protocolForTenant({ enterprise: true }));
console.log(protocolForTenant({ enterprise: false }));
