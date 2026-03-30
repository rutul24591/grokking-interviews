const clientOrder = ['b', 'a', 'c'];
const serverOrder = ['a', 'b', 'c'];
console.log({ clientOrder, serverOrder, requiresReconciliation: JSON.stringify(clientOrder) !== JSON.stringify(serverOrder) });
