// Simplified async replication
primary.on('write', (log) => {
  replica.apply(log).catch(err => console.error('replication lag', err));
});
