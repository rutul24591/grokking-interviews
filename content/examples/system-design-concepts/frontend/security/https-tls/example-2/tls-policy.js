const policy = {
  minVersion: "TLSv1.2",
  // In practice, prefer platform defaults unless you have a reason; if you customize, review periodically.
  honorCipherOrder: true,
  requestCert: false,
  rejectUnauthorized: true
};

process.stdout.write(`${JSON.stringify(policy, null, 2)}\n`);

