// etcd lock (pseudo)
await etcd.lock('/locks/report');
try { await doWork(); } finally { await etcd.unlock('/locks/report'); }
