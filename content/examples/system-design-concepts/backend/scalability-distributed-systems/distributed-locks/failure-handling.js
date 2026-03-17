// Backoff if lock not acquired
if (!locked) await new Promise(r => setTimeout(r, 100));
