// Retry lock on lease expiry
try { await etcd.lock('/locks/report'); } catch { await backoff(); }
