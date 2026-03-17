// Run compensations on partial failure
try { await createOrderSaga(order); }
catch { console.log('compensations executed'); }
