// Service A calls Service B
const res = await fetch('http://billing/charge', { method: 'POST' });
if (!res.ok) throw new Error('billing_failed');
