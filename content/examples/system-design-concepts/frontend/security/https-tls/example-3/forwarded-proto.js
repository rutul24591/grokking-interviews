function externalOrigin({ host, forwardedProto, trustProxy }) {
  const proto = trustProxy && forwardedProto ? forwardedProto : "http";
  return `${proto}://${host}`;
}

const cases = [
  { host: "app.example.com", forwardedProto: "https", trustProxy: true },
  { host: "app.example.com", forwardedProto: "https", trustProxy: false },
  { host: "app.example.com", forwardedProto: null, trustProxy: true }
];

for (const c of cases) process.stdout.write(`${JSON.stringify(c)} -> ${externalOrigin(c)}\n`);

