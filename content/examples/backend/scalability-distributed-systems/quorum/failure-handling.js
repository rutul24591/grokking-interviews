// If quorum not met, surface error
try { await write('user:1', { name: 'Asha' }); }
catch { console.error('write_failed'); }
