function suspicious(events) {
  const failures = events.filter((event) => event.action === 'login' && event.result === 'failure').length;
  const newIpRevocation = events.some((event) => event.action === 'session_revoked' && event.sourceIp !== '203.0.113.4');
  return { suspicious: failures >= 3 || newIpRevocation, failures, newIpRevocation };
}

console.log(suspicious([
  { action: 'login', result: 'failure', sourceIp: '203.0.113.4' },
  { action: 'login', result: 'failure', sourceIp: '203.0.113.4' },
  { action: 'session_revoked', result: 'success', sourceIp: '198.51.100.7' }
]));
